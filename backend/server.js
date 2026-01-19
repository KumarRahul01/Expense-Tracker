import express from "express"
import { configDotenv } from "dotenv";
import { sql } from "./config/db.js";
configDotenv();

const app = express();
const PORT = process.env.PORT || 3000;


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
});

// Fetch Transactions Based On UserId
app.get("/api/transactions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // const result = await sql`SELECT COUNT(*) FROM transactions WHERE user_id = ${userId}`;

    // if (result[0].count > 0) {
    //   const transaction = await sql`
    //   SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
    // `
    //   console.log(transaction);
    //   res.status(200).json({ message: "Transaction Fetched Successfully!", data: transaction });
    // } else {
    //   console.log("Error in Fetching userId")
    //   res.status(500).json({ message: "Error in Fetching userId" })
    // }

    const transaction = await sql`
    SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
  `
    console.log(transaction);
    res.status(200).json({ message: "Transaction Fetched Successfully!", data: transaction });


  } catch (error) {
    console.log("Error in creating transaction", error)
    res.status(500).json({ message: "Internal Server Error" })
  }
})

// Create Transactions Based On UserId
app.post("/api/transactions", async (req, res) => {
  try {
    const { title, amount, category, user_id } = req.body;
    if (!title || !category || !user_id || amount === undefined) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const transaction = await sql`
      INSERT INTO transactions(user_id, title, amount, category)
      VALUES (${user_id}, ${title}, ${amount}, ${category})
      RETURNING *
    `
    console.log(transaction);

    res.status(201).json({ message: "Transaction Created Successfully!", data: transaction[0] })


  } catch (error) {
    console.log("Error in creating transaction", error)
    res.status(500).json({ message: "Internal Server Error" })
  }
})

app.delete("/api/transactions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid Transaction ID" })
    }

    const result = await sql`
      DELETE FROM transactions WHERE id = ${id} RETURNING *;
    `

    if (result.length === 0) {
      res.status(404).json({ message: "Transactions not found" })
    }

    res.status(200).json({ message: "Transaction deleted succesfully!" })

  } catch (error) {
    console.log("Error in deleting transaction", error)
    res.status(500).json({ message: "Internal Server Error" })
  }
})

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
})


