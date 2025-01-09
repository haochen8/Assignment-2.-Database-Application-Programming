const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Add a book to the cart
router.post("/add", async (req, res) => {
  const { userid, isbn, quantity } = req.body;

  if (!userid || !isbn || !quantity) {
    return res
      .status(400)
      .json({ message: "Missing userid, isbn, or quantity in request body." });
  }

  try {
    await db.query(
      "INSERT INTO cart (userid, isbn, qty) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE qty = qty + ?",
      [userid, isbn, quantity, quantity]
    );
    res.json({
      message: `Book with ISBN ${isbn} added to the cart successfully.`,
    });
  } catch (error) {
    console.error("Error adding book to cart", error);
    res
      .status(500)
      .json({ message: "Error adding book to cart. Please try again." });
  }
});

// View Cart
router.get("/view", async (req, res) => {
  const { userid } = req.query;

  if (!userid) {
    return res
      .status(400)
      .json({ message: "Missing userid in request query." });
  }

  try {
    const [cartItems] = await db.query(
      `SELECT c.isbn, b.title, b.price, c.qty, (b.price * c.qty) AS total 
           FROM cart c 
           JOIN books b ON c.isbn = b.isbn 
           WHERE c.userid = ?`,
      [userid]
    );

    if (cartItems.length === 0) {
      return res.status(204).json({ message: "Your cart is empty." });
    }

    res.json({
      cart: cartItems,
      total: cartItems.reduce((sum, item) => sum + item.total, 0),
    });
  } catch (err) {
    console.error("Error fetching cart:", err.message);
    res.status(500).json({ message: "Error fetching cart. Please try again." });
  }
});

// Checkout
router.post("/checkout", async (req, res) => {
  const { userid } = req.body;

  if (!userid) {
    return res.status(400).json({ message: "Missing userid in request body." });
  }

  try {
    const [cartItems] = await db.query(
      `SELECT c.isbn, b.title, b.price, c.qty, (b.price * c.qty) AS total 
       FROM cart c 
       JOIN books b ON c.isbn = b.isbn 
       WHERE c.userid = ?`,
      [userid]
    );

    if (cartItems.length === 0) {
      return res.status(204).json({ message: "Your cart is empty." });
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + item.total, 0);

    // Create an order
    const [orderResult] = await db.query(
      `INSERT INTO orders (userid, created, shipAddress, shipCity, shipZip) 
           SELECT userid, CURRENT_DATE, address, city, zip FROM members WHERE userid = ?`,
      [userid]
    );
    const orderId = orderResult.insertId;

    // Add order details
    const orderDetails = cartItems.map((item) => [
      orderId,
      item.isbn,
      item.qty,
      item.total,
    ]);
    await db.query("INSERT INTO odetails (ono, isbn, qty, amount) VALUES ?", [
      orderDetails,
    ]);

    // Clear the cart
    await db.query("DELETE FROM cart WHERE userid = ?", [userid]);

    res.json({
      message: `Checkout complete! Your order ID is ${orderId}.`,
      invoice: {
        orderId,
        items: cartItems,
        total: totalAmount,
      },
    });
  } catch (err) {
    console.error("Error during checkout:", err.message);
    res
      .status(500)
      .json({ message: "Error during checkout. Please try again." });
  }
});

module.exports = router;
