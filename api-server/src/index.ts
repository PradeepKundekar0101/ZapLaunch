import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Redis from "ioredis";
import { uuid } from "uuidv4";
import { cassandraClient } from "./services/cassandraClient";
import projectRoute from "./routes/project";
import userRoute from "./routes/user";
import authRoute from "./routes/auth";
import analytics from "./routes/analytics";
import passport from "passport";
import GitHubStrategy from "passport-github2";
import { PrismaClient } from "@prisma/client";
import session from "express-session";
dotenv.config();
const PORT = process.env.PORT || 8000;
const prismaClient = new PrismaClient();
const REDIS_URI = process.env.REDIS_URI || "";
let deploymentId = "";

cassandraClient
  .connect()
  .then(() => {
    console.log("Cassandra Client connected Successfully! ");
    cassandraClient
      .execute(
        `
    CREATE TABLE IF NOT EXISTS default_keyspace.Logs (
      event_id UUID,
      deploymentId UUID,
      log text,
      timestamp timestamp,
      PRIMARY KEY (event_id)
      );
      `
      )
      .then((result) => {
        console.log("Table created");
      })
      .catch((error) => {
        console.log("first");
        console.error("Error executing query:", error.message);
      });
  })
  .catch((e: Error) => {
    console.log(e.message);
  });

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
passport.serializeUser(function (user, cb) {
  cb(null, user);
});
passport.deserializeUser(function (obj: any, cb) {
  cb(null, obj);
});
app.get("/", (req, res) => {
  res.send("Hello from launch pilot");
});

const subscriber = new Redis(REDIS_URI);

const initSubscriber = async () => {
  subscriber.psubscribe("logs:*");
  console.log("Redis subscribed to Logs Channel");
  subscriber.on(
    "pmessage",
    async (pattern: string, channel: string, message: string) => {
      deploymentId = channel.split(":")[1];
      try {
        await cassandraClient.execute(
          `INSERT INTO default_keyspace.Logs (event_id, deploymentId, log, timestamp) VALUES (?, ?, ?, toTimestamp(now()));`,
          [uuid(), deploymentId, message]
        );
        console.log("Inserted in Logs DB");
      } catch (error: any) {
        console.log(error.message);
      }
    }
  );
};
initSubscriber();

passport.use(
  new GitHubStrategy.Strategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      callbackURL: process.env.API_SERVER_URL + "/api/v1/auth/github/callback",
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) => {
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
              email:
                profile.emails && profile.emails[0]?.value
                  ? profile.emails[0].value
                  : null,
              avatarUrl:
                profile.photos && profile.photos[0]?.value
                  ? profile.photos[0].value
                  : "",
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
app.use("/api/v1/project", projectRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/analytics", analytics);

app.listen(PORT, () => {
  console.log("API server running at port " + PORT);
});
