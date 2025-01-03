const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Add a book to the cart
router.post("/add", async (req, res) => {
  const { userid, isbn, quantity } = req.body;

  try {
    await db.query(
      'INSERT INTO cart (userid, isbn, qty) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE qty = qty + ?',
      [userid, isbn, quantity, quantity]
    );
    res.send(`Book with ISBN ${isbn} added to the cart successfully.`);
  } catch (error) {
    console.error("Error adding book to cart", error);
    res.status(500).send("Error adding book to cart. Please try again.");
  }
})

module.exports = router;