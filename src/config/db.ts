import { Sequelize } from "sequelize";
import { MysqlStore } from "wwebjs-mysql";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "database",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: false
  }
);

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "database",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const tableInfo = {
  table: "whatsapp_sessions",
  session_column: "session_name",
  data_column: "data",
  updated_at_column: "updated_at"
};

export const whatsappStore = new MysqlStore({ pool, tableInfo });

export default sequelize;
