const express = require('express');
const jwt = require('jsonwebtoken');
const books = require('./booksdb.js');

const regd_users = express.Router();
const users = [];

// Check whether username already exists
const isValid = (username) => {
    return users.some(user => user.username === username);
};

// Check username and password
const authenticatedUser = (username, password) => {
    return users.some(
        user => user.username === username && user.password === password
    );
};

// Task 7: Login
regd_users.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: 'Username and password are required'
        });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({
            message: 'Invalid username or password'
        });
    }

    const token = jwt.sign(
        { username },
        'access',
        { expiresIn: '1h' }
    );

    req.session.authorization = {
        accessToken: token
    };

    return res.status(200).json({
        message: 'User successfully logged in',
        token
    });
});

// Task 8: Add or modify a review
regd_users.put('/auth/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;
    const { review } = req.body;

    if (!books[isbn]) {
        return res.status(404).json({ message: 'Book not found' });
    }

    if (typeof review !== 'string' || !review.trim()) {
        return res.status(400).json({ message: 'Review is required' });
    }

    books[isbn].reviews[username] = review.trim();

    return res.status(200).json({
        message: 'Review added or updated successfully'
    });
});

// Task 9: Delete your own review
regd_users.delete('/auth/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;

    if (!books[isbn]) {
        return res.status(404).json({ message: 'Book not found' });
    }

    if (!Object.prototype.hasOwnProperty.call(books[isbn].reviews, username)) {
        return res.status(404).json({ message: 'Review not found' });
    }

    delete books[isbn].reviews[username];

    return res.status(200).json({
        message: 'Review deleted successfully'
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;