const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();
const db = require('./config/db');
const membersRouter = require('./routes/members');
const booksRouter = require('./routes/books');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MySQL
db.getConnection((err, connection) => {
    if (err) {
        console.error('MySQL connection error:', err.message);
    } else {
        console.log('Connected to MySQL database.');
        connection.release();
    }
});

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Basic Route
app.use('/members', membersRouter);
app.use('/books', booksRouter);
app.get('/', (req, res) => {
    res.send('Welcome to your new Express app!');
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
