const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET /members
router.get("/", async (req, res) => {
  const query = "SELECT * FROM Members";

  try {
    const [results] = await db.query(query);
    console.log(results);
    res.status(200).json({
      status: "success",
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error getting members.",
    });
  }
});

// POST to add a new member
router.post("/register", async (req, res) => {
  const { fname, lname, address, city, state, zip, phone, email, password } =
    req.body;

  try {
    await db.query(
      "INSERT INTO Members (fname, lname, address, city, zip, phone, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [fname, lname, address, city, state, phone, email, password]
    );
    res.send(
      "You have registered successfully!\nPress Enter to go back to Menu."
    );
  } catch (error) {
    console.error("Error registering member", error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).send({
        error: "Email already exists. Please try again.",
      });
    }
    res.status(500).send("Error registering member. Please try again.");
  }
});

// POST to login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [results] = await db.query(
      "SELECT * FROM Members WHERE email = ? AND password = ?",
      [email, password]
    );

    if (results.length > 0) {
      res.send('Welcome to the Online Book Store Member Menu:\n1. Browse by Subject\n2. Search by Author/Title\n3. Check Out\n4. Logout');
    } else {
      res.send('Invalid email or password. Please try again.');
    }
  } catch (error) {
    console.error("Error logging in member", error);
    res.status(500).send("Error logging in member. Please try again.");
  }
});

module.exports = router;
