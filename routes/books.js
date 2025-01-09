const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Browse by Subject
router.get("/browse", async (req, res) => {
  try {
    const [subjects] = await db.query(
      "SELECT DISTINCT subject FROM books ORDER BY subject ASC"
    );

    const response = {
      message: "Choose a subject from the list below:",
      subjects: subjects.map((row) => row.subject),
    };

    console.log("Subjects response:", response); // Log the response
    res.json(response);
  } catch (error) {
    console.error("Error fetching subjects", error);
    res
      .status(500)
      .json({ message: "Error getting subjects. Please try again." });
  }
});

// Browse books within a subject
router.get("/browse/:subject", async (req, res) => {
  const subject = decodeURIComponent(req.params.subject);
  console.log("Received subject:", subject); // Log the decoded subject
  const { page = 1 } = req.query;
  const limit = 2;
  const offset = (page - 1) * limit;

  try {
    const [books] = await db.query(
      "SELECT * FROM books WHERE subject = ? LIMIT ? OFFSET ?",
      [subject, limit, offset]
    );
    console.log("Books found:", books); // Log the books retrieved
    if (books.length === 0) {
      res.json({ message: "No more books available for this subject." });
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
    res.status(500).json({ message: "Error getting books. Please try again." });
  }
});

router.get("/search", async (req, res) => {
  const { type, query, page = 1 } = req.query;
  const limit = 3;
  const offset = (page - 1) * limit;

  try {
    let searchQuery;
    if (type === "author") {
      searchQuery = "SELECT * FROM books WHERE author LIKE ? LIMIT ? OFFSET ?";
    } else if (type === "title") {
      searchQuery = "SELECT * FROM books WHERE title LIKE ? LIMIT ? OFFSET ?";
    } else {
      return res
        .status(400)
        .json({ message: 'Invalid search type. Use "author" or "title".' });
    }

    const [books] = await db.query(searchQuery, [`%${query}%`, limit, offset]);

    if (books.length === 0) {
      res.json({ message: `No books found for ${type}: "${query}".` });
      return;
    }

    res.json({
      message: `Books found for ${type}: "${query}"`,
      books: books.map((book) => ({
        Author: book.author,
        Title: book.title,
        ISBN: book.isbn,
        Price: book.price,
        Subject: book.subject,
      })),
    });
  } catch (err) {
    console.error("Error searching books:", err.message);
    res
      .status(500)
      .json({ message: "Error searching books. Please try again." });
  }
});

module.exports = router;
