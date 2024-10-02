"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const ioredis_1 = __importDefault(require("ioredis"));
const uuidv4_1 = require("uuidv4");
const cassandraClient_1 = require("./services/cassandraClient");
const project_1 = __importDefault(require("./routes/project"));
const user_1 = __importDefault(require("./routes/user"));
const auth_1 = __importDefault(require("./routes/auth"));
const passport_1 = __importDefault(require("passport"));
const passport_github2_1 = __importDefault(require("passport-github2"));
const client_1 = require("@prisma/client");
dotenv_1.default.config();
const PORT = process.env.PORT || 8000;
const prismaClient = new client_1.PrismaClient();
const REDIS_URI = process.env.REDIS_URI || "";
let deploymentId = "";
cassandraClient_1.cassandraClient
    .connect()
    .then(() => {
    console.log("Cassandra Client connected Successfully! ");
    cassandraClient_1.cassandraClient
        .execute(`
    CREATE TABLE IF NOT EXISTS default_keyspace.Logs (
      event_id UUID,
      deploymentId UUID,
      log text,
      timestamp timestamp,
      PRIMARY KEY (event_id)
      );
      `)
        .then((result) => {
        console.log("Table created");
    })
        .catch((error) => {
        console.log("first");
        console.error("Error executing query:", error.message);
    });
})
    .catch((e) => {
    console.log(e.message);
});
const app = (0, express_1.default)();
app.use(passport_1.default.initialize());
app.get("/", (req, res) => {
    res.send("Hello from launch pilot");
});
const subscriber = new ioredis_1.default(REDIS_URI);
const initSubscriber = async () => {
    subscriber.psubscribe("logs:*");
    console.log("Redis subscribed to Logs Channel");
    subscriber.on("pmessage", async (pattern, channel, message) => {
        deploymentId = channel.split(":")[1];
        try {
            await cassandraClient_1.cassandraClient.execute(`INSERT INTO default_keyspace.Logs (event_id, deploymentId, log, timestamp) VALUES (?, ?, ?, toTimestamp(now()));`, [(0, uuidv4_1.uuid)(), deploymentId, message]);
            console.log("Inserted in Logs DB");
        }
        catch (error) {
            console.log(error.message);
        }
    });
};
initSubscriber();
passport_1.default.use(new passport_github2_1.default.Strategy({
    clientID: process.env.GITHUB_CLIENT_ID || "",
    clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    callbackURL: "http://localhost:8000/api/v1/auth/github/callback",
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await prismaClient.user.findFirst({
            where: { githubId: profile.githubId },
        });
        if (!user) {
            user = await prismaClient.user.create({
                data: {
                    githubId: profile.id,
                    userName: profile.username || profile.login,
                    fullName: profile.displayName || profile.name || "",
                    email: profile.emails && profile.emails[0]?.value
                        ? profile.emails[0].value
                        : null,
                    avatarUrl: profile.photos && profile.photos[0]?.value
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
        }
        else {
            user = await prismaClient.user.update({
                where: { id: user.id },
                data: {
                    githubAccessToken: accessToken,
                },
            });
        }
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
}));
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: "*" }));
app.use("/api/v1/project", project_1.default);
app.use("/api/v1/user", user_1.default);
app.use("/api/v1/auth", auth_1.default);
app.listen(PORT, () => {
    console.log("API server running at port " + PORT);
});
