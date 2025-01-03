const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Browse by Subject
router.get("/browse", async (req, res) => {
  try {
    const [subjects] = await db.query(
      "SELECT DISTINCT subject FROM books ORDER BY subject ASC"
    );

    res.json({
      message: "Choose a subject from the list below:",
      subjects: subjects.map((row, index) => `${index + 1}. ${row.subject}`),
    });
  } catch (error) {
    res.status(500).send("Error getting subjects. Please try again.");
  }
});

// Browse books within a subject
router.get("/browse/:subject", async (req, res) => {
  const { subject } = req.params;
  const { page = 1 } = req.query;
  const limit = 2;
  const offset = (page - 1) * limit;

  try {
    const [books] = await db.query(
      "SELECT * FROM books WHERE subject = ? LIMIT ? OFFSET ?",
      [subject, limit, offset]
    );

    if (books.length === 0) {
      res.send("No more books available for this subject.");
      return;
    }

    res.json({
      message: `Books in ${subject}`,
      books: books.map((book) => ({
        Author: book.author,
        Title: book.title,
        ISBN: book.isbn,
        Price: book.price,
        Subject: book.subject,
      })),
      nextOptions: [
        "Enter ISBN to add to Cart",
        "Press Enter to go back to menu",
        "Press n Enter to continue browsing",
      ],
    });
  } catch (error) {
    console.error("Error fetching books", error);
    res.status(500).send("Error getting books. Please try again.");
  }
});

module.exports = router;