import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Redis from "ioredis";
import { uuid } from "uuidv4";
import { cassandraClient, downloadScbFromS3 } from "./services/cassandraClient";
import projectRoute from "./routes/project";
import userRoute from "./routes/user";
import authRoute from "./routes/auth";
import analytics from "./routes/analytics";
import passport from "passport";
import GitHubStrategy from "passport-github2";
import { PrismaClient } from "@prisma/client";
import session from "express-session";
import { pingExternalServer } from "./utils/ping";

dotenv.config();
const PORT = process.env.PORT || 8000;
const prismaClient = new PrismaClient();
const REDIS_URI = process.env.REDIS_URI || "";
let deploymentId = "";

async function initializeCassandra() {
  try {
    await downloadScbFromS3();
    console.log("SCB download completed.");
    
    await cassandraClient.connect();
    console.log("Cassandra Client connected Successfully!");
    
    await cassandraClient.execute(`
      CREATE TABLE IF NOT EXISTS default_keyspace.Logs (
        event_id UUID,
        deploymentId UUID,
        log text,
        timestamp timestamp,
        PRIMARY KEY (event_id)
      );
    `);
    console.log("Table created or already exists");
  } catch (error) {
    console.error("Error initializing Cassandra:", error);
    throw error;
  }
}

async function initializeRedis() {
  const subscriber = new Redis(REDIS_URI);
  
  try {
    await subscriber.psubscribe("logs:*");
    console.log("Redis subscribed to Logs Channel");
    
    subscriber.on("pmessage", async (pattern, channel, message) => {
      deploymentId = channel.split(":")[1];
      try {
        await cassandraClient.execute(
          `INSERT INTO default_keyspace.Logs (event_id, deploymentId, log, timestamp) VALUES (?, ?, ?, toTimestamp(now()));`,
          [uuid(), deploymentId, message]
        );
        console.log("Inserted in Logs DB");
      } catch (error) {
        console.error("Error inserting log:", error);
      }
    });
  } catch (error) {
    console.error("Error initializing Redis:", error);
    throw error;
  }
}

async function startServer() {
  try {
    await initializeCassandra();
    await initializeRedis();

    const app = express();

    app.use(
      session({
        resave: false,
        saveUninitialized: true,
        secret: process.env.SESSION_SECRET!,
      })
    );

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, cb) => {
      cb(null, user);
    });

    passport.deserializeUser((obj: any, cb) => {
      cb(null, obj);
    });

    passport.use(
      new GitHubStrategy.Strategy(
        {
          clientID: process.env.GITHUB_CLIENT_ID || "",
          clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
          callbackURL: process.env.API_SERVER_URL + "/api/v1/auth/github/callback",
        },
        async (accessToken: string, refreshToken: string, profile: any, done: any) => {
          try {
            let user = await prismaClient.user.findFirst({
              where: { githubId: profile.id },
            });

            if (!user) {
              user = await prismaClient.user.create({
                data: {
                  githubId: profile.id,
                  userName: profile.username || profile.login,
                  fullName: profile.displayName || profile.name || "",
                  email: profile.emails && profile.emails[0]?.value ? profile.emails[0].value : null,
                  avatarUrl: profile.photos && profile.photos[0]?.value ? profile.photos[0].value : "",
                  profileUrl: profile.profileUrl || profile._json.html_url,
                  bio: profile._json.bio || "",
                  location: profile._json.location || "",
                  company: profile._json.company || "",
                  blog: profile._json.blog || "",
                  githubCreatedAt: new Date(profile._json.created_at),
                  githubAccessToken: accessToken || "",
                },
              });
            } else {
              user = await prismaClient.user.update({
                where: { id: user.id },
                data: {
                  githubAccessToken: accessToken,
                },
              });
              console.log("Existing user updated:", user);
            }

            return done(null, user);
          } catch (error) {
            console.error("Error in GitHub strategy:", error);
            return done(error);
          }
        }
      )
    );

    app.use(express.json());
    app.use(cors({ origin: "*" }));

    app.get("/", (req, res) => {
      res.send("Hello from launch pilot");
    });

    app.use("/api/v1/project", projectRoute);
    app.use("/api/v1/user", userRoute);
    app.use("/api/v1/auth", authRoute);
    app.use("/api/v1/analytics", analytics);

    app.listen(PORT, () => {
      setInterval(pingExternalServer, 30000);
      console.log("API server running at port " + PORT);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();