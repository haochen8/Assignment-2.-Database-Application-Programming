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
  const { fname, lname, address, city, zip, phone, email, password } = req.body;

  try {
    await db.query(
      "INSERT INTO Members (fname, lname, address, city, zip, phone, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [fname, lname, address, city, zip, phone, email, password]
    );
    res.json(
      "You have registered successfully!\nPress Enter to go back to Menu."
    );
  } catch (error) {
    console.error("Error registering member", error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        error: "Email already exists. Please try again.",
      });
    }
    res.status(500).json("Error registering member. Please try again.");
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
      const user = results[0];

      if (user.password === password) {
        res.json({
          message: "You have successfully logged in!",
          userid: user.userid,
          fname: user.fname,
          lname: user.lname,
        });
      } else {
        res
          .status(401)
          .json({ message: "Invalid email or password. Please try again." });
      }
    }
  } catch (error) {
    console.error("Error logging in member", error);
    res.status(500).json({ message: "Error logging in. Please try again." });
  }
});

router.post("/logout", (req, res) => {
  if (!req.session) {
    return res.status(400).json({ message: "You are not logged in." });
  }

  req.session.destroy((err) => {
    if (err) {
      console.error("Error logging out:", err.message);
      res.status(500).json({ message: "Error logging out. Please try again." });
    } else {
      res.json({ message: "You have successfully logged out." });
    }
  });
});

module.exports = router;
