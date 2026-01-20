import express from "express"
import { configDotenv } from "dotenv";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
configDotenv();

import transactionRoute from "./routes/transactions.route.js"

const app = express();
const PORT = process.env.PORT || 3000;


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);



app.get("/health", (req, res) => {
  res.send("It's working");
});

// Routes Middleware
app.use("/api/transactions", transactionRoute);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
})


