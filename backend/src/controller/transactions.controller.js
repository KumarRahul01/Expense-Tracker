import { sql } from "../config/db.js";

export const getTransactionsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    // To find the user_id in the db use this

    /* 
    const result = await sql`SELECT COUNT(*) FROM transactions WHERE user_id = ${userId}`;
    if (result[0].count > 0) {
      const transaction = await sql`
      SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
    `
      console.log(transaction);
      res.status(200).json({ message: "Transaction Fetched Successfully!", data: transaction });
    } else {
      console.log("Error in Fetching userId")
      res.status(500).json({ message: "Error in Fetching userId" })
    }
    */

    const transaction = await sql`
    SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
  `
    console.log(transaction);
    return res.status(200).json({ message: "Transaction Fetched Successfully!", data: transaction });


  } catch (error) {
    console.log("Error in creating transaction", error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}


export const craeteTransactionsByUserId = async (req, res) => {
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

    return res.status(201).json({ message: "Transaction Created Successfully!", data: transaction[0] })


  } catch (error) {
    console.log("Error in creating transaction", error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}


export const deleteTransactionsById = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid Transaction ID" })
    }

    const result = await sql`
      DELETE FROM transactions WHERE id = ${id} RETURNING *;
    `

    if (result.length === 0) {
      return res.status(404).json({ message: "Transactions not found" })
    }

    return res.status(200).json({ message: "Transaction deleted succesfully!" })

  } catch (error) {
    console.log("Error in deleting transaction", error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}


export const getSummaryByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const balanceResult = await sql`
    SELECT COALESCE(SUM(amount), 0) AS balance 
    FROM transactions 
    WHERE user_id = ${userId}
  `

    const incomeResult = await sql`
    SELECT COALESCE(SUM(amount), 0) AS income 
    FROM transactions 
    WHERE user_id = ${userId} AND amount > 0
  `

    const expensesResult = await sql`
    SELECT COALESCE(SUM(amount), 0) AS expenses 
    FROM transactions 
    WHERE user_id = ${userId} AND amount < 0
  `

    return res.status(200).json({
      message: "Summary fetched succesfully!",
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expensesResult[0].expenses
    })

  } catch (error) {
    console.log("Error in getting summary", error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}
