const express = require('express');
const router = express.Router();

// GET /members
router.get('/', (req, res) => {
    res.send('GET /members');
});

// POST to add a new member
router.post('/add-member', async (req, res) => {
  const { name, email, phone_number } = req.body;
  const query = 'INSERT INTO Members (name, email, phone_number) VALUES (?, ?, ?)';

  try {
    const [results] = await db.query(query, [name, email, phone_number]);
    res.status(201).json({
      status: 'success',
      message: 'Member added successfully.',
      member_id: results.insertId
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error adding member.'
    });
  }
});

module.exports = router;