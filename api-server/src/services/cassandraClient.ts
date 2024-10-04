import dotenv from 'dotenv'
dotenv.config();
import cassandra from "cassandra-driver"
import path from 'path';
const cloud = { secureConnectBundle: path.join(__dirname,"scb.zip") };
const authProvider = new cassandra.auth.PlainTextAuthProvider('token', process.env['ASTRA_DB_APPLICATION_TOKEN']!);
export const cassandraClient = new cassandra.Client({ cloud, authProvider });
