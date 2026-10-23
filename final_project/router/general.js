const express = require('express');
const axios = require('axios');
const books = require('./booksdb.js');
const isValid = require('./auth_users.js').isValid;
const users = require('./auth_users.js').users;

const public_users = express.Router();

// Task 1 and Task 10: Get all books using Axios and async/await
public_users.get('/', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/books-data');
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Unable to retrieve books' });
    }
});

// Internal route providing the book data for Axios requests
public_users.get('/books-data', (req, res) => {
    res.status(200).json(books);
});

// Task 2 and Task 11: Get book by ISBN using Axios Promise
public_users.get('/isbn/:isbn', (req, res) => {
    axios.get(`http://localhost:5000/books-data/${encodeURIComponent(req.params.isbn)}`)
        .then(response => res.status(200).json(response.data))
        .catch(error => {
            if (error.response && error.response.status === 404) {
                return res.status(404).json({ message: 'Book not found' });
            }
            res.status(500).json({ message: 'Unable to retrieve book' });
        });
});

// Internal route for retrieving one book by ISBN
public_users.get('/books-data/:isbn', (req, res) => {
    const book = books[req.params.isbn];

    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json(book);
});

// Task 3 and Task 12: Get books by author using Axios Promise
public_users.get('/author/:author', (req, res) => {
    axios.get(`http://localhost:5000/books-by-author-data/${encodeURIComponent(req.params.author)}`)
        .then(response => res.status(200).json(response.data))
        .catch(() => res.status(500).json({ message: 'Unable to retrieve books' }));
});

// Internal route for author search
public_users.get('/books-by-author-data/:author', (req, res) => {
    const author = req.params.author.toLowerCase();
    const result = Object.values(books).filter(
        book => book.author.toLowerCase() === author
    );
    res.status(200).json(result);
});

// Task 4 and Task 13: Get books by title using Axios and async/await
public_users.get('/title/:title', async (req, res) => {
    try {
        const response = await axios.get(
            `http://localhost:5000/books-by-title-data/${encodeURIComponent(req.params.title)}`
        );
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Unable to retrieve books' });
    }
});

// Internal route for title search
public_users.get('/books-by-title-data/:title', (req, res) => {
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

module.exports.general = public_users;
