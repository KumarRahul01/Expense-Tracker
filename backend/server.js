import express from "express"
import { configDotenv } from "dotenv";
import { sql } from "./config/db.js";
configDotenv();

const app = express();
const PORT = process.env.PORT || 3000;

const initDB = async () => {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions(
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      category VARCHAR(255) NOT NULL,
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`

    console.log("Database initialized Successfully!");
  } catch (error) {
    console.error("Error in initializing DB", error);
    process.exit(1);
  }
}

app.get("/", (req, res) => {
  res.send("It's working");
})

initDB().then(() => {
  app.listen(() => {
    console.log(`server is running on port ${PORT}`)
  })
})

