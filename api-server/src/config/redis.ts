import Redis from "ioredis";
import { uuid } from "uuidv4";
import { cassandraClient } from "../services/cassandraClient";

const REDIS_URI = process.env.REDIS_URI || "";

let deploymentId = "";
const subscriber = new Redis(REDIS_URI);

export const initSubscriber = async () => {
  subscriber.psubscribe("logs:*");
  console.log("Redis subscribed to Logs Channel")
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