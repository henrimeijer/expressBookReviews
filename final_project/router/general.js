const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register new user
public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully" });
  } else {
    return res.status(400).json({ message: "Username already exists" });
  }
});

// Get the book list synchronously
// public_users.get('/',function (req, res) {
//   res.send(JSON.stringify({books}, null, 3));
// });

// Get the book list with async/await
public_users.get('/', async function (req, res) {
  try {
    const getBooks = () =>
      new Promise((resolve, reject) => {
        books ? resolve(books) : reject(new Error("No books available"));
      });

      const allBooks = await getBooks();
      res.status(200).send(JSON.stringify({ books: allBooks }, null, 3));
  } catch (err) {
    res.status(500).json({ message: "Error retrieving books", error: err.message });
  }
});

// Get book details based on ISBN synchronously
// public_users.get('/isbn/:isbn',function (req, res) {
//   const isbn = req.params.isbn;
// const book = books[isbn];
//   if (book) {
//     res.status(200).send(JSON.stringify(book, null, 3));
//   } else {
//     res.status(404).json({ message: "Book not found" });
//   }
//  });

// Get book details based on ISBN with async/await
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const book = await new Promise((resolve, reject) => {
      books[isbn]
      ? resolve(books[isbn])
      : reject(new Error("Book not found"));
    });
    res.status(200).send(JSON.stringify(book, null, 3));
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let filteredAuthorBooks = Object.values(books).filter((book) => book.author.toLowerCase() === author.toLowerCase());
  if (filteredAuthorBooks.length > 0) {
    res.status(200).send(JSON.stringify(filteredAuthorBooks, null, 3));
  } else {
    res.status(404).json({ message: "No books found for the specified author" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let filteredTitleBooks = Object.values(books).filter((book) => book.title.toLowerCase() === title.toLowerCase());
  if (filteredTitleBooks.length > 0) {
    res.status(200).send(JSON.stringify(filteredTitleBooks, null, 3));
  } else {
    res.status(404).json({ message: "No books found for the specified title" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.status(200).send(JSON.stringify(book.reviews, null, 3));
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
