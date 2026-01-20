import { Router } from "express";
import { sql } from "../config/db.js";
import { craeteTransactionsByUserId, deleteTransactionsById, getSummaryByUserId, getTransactionsByUserId } from "../controller/transactions.controller.js";

const router = Router();

// Fetch Transactions Based On UserId
router.get("/:userId", getTransactionsByUserId)

// Create Transactions Based On UserId
router.post("/", craeteTransactionsByUserId)

// Delete Transactions Based On transactionId
router.delete("/:id", deleteTransactionsById)


// Get Summary of a User Account Based On userId
router.get("/summary/:userId", getSummaryByUserId)



export default router;
