
const express = require('express');
const axios = require('axios');
const books = require('./booksdb.js');
const isValid = require('./auth_users.js').isValid;
const users = require('./auth_users.js').users;

const public_users = express.Router();

// Task 1: Get all books
public_users.get('/', (req, res) => {
    res.status(200).json(books);
});

// Task 2: Find a book by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const book = books[req.params.isbn];

    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json(book);
});

// Task 3: Find books by author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author.toLowerCase();

    const result = Object.values(books).filter(
        book => book.author.toLowerCase() === author
    );

    res.status(200).json(result);
});

// Task 4: Find books by title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title.toLowerCase();

    const result = Object.values(books).filter(
        book => book.title.toLowerCase() === title
    );

    res.status(200).json(result);
});

// Task 5: Get reviews for a book
public_users.get('/review/:isbn', (req, res) => {
    const book = books[req.params.isbn];

    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json(book.reviews);
});

// Task 6: Register a user
public_users.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: 'Username and password are required'
        });
    }

    if (isValid(username)) {
        return res.status(409).json({
            message: 'Username already exists'
        });
    }

    users.push({ username, password });

    res.status(200).json({
        message: 'User successfully registered'
    });
});

// Task 10: Get all books using Axios and async/await
public_users.get('/async/books', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/');
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({
            message: 'Unable to retrieve books'
        });
    }
});

// Task 11: Find a book by ISBN using Axios and Promise
public_users.get('/async/isbn/:isbn', (req, res) => {
    const isbn = encodeURIComponent(req.params.isbn);

    axios.get(`http://localhost:5000/isbn/${isbn}`)
        .then(response => {
            res.status(200).json(response.data);
        })
        .catch(error => {
            if (error.response && error.response.status === 404) {
                return res.status(404).json({
                    message: 'Book not found'
                });
            }

            res.status(500).json({
                message: 'Unable to retrieve book'
            });
        });
});

// Task 12: Find books by author using Axios and Promise
public_users.get('/async/author/:author', (req, res) => {
    const author = encodeURIComponent(req.params.author);

    axios.get(`http://localhost:5000/author/${author}`)
        .then(response => {
            res.status(200).json(response.data);
        })
        .catch(() => {
            res.status(500).json({
                message: 'Unable to search books'
            });
        });
});

// Task 13: Find books by title using Axios and async/await
public_users.get('/async/title/:title', async (req, res) => {
    try {
        const title = encodeURIComponent(req.params.title);
        const response = await axios.get(
            `http://localhost:5000/title/${title}`
        );

        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({
            message: 'Unable to search books'
        });
    }
});

module.exports.general = public_users;
