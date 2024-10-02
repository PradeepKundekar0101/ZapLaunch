"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cassandraClient = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cassandra_driver_1 = __importDefault(require("cassandra-driver"));
const path_1 = __importDefault(require("path"));
const cloud = { secureConnectBundle: path_1.default.join(__dirname, "scb.zip") };
const authProvider = new cassandra_driver_1.default.auth.PlainTextAuthProvider('token', process.env['ASTRA_DB_APPLICATION_TOKEN']);
exports.cassandraClient = new cassandra_driver_1.default.Client({ cloud, authProvider });
