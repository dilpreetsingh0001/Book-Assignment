const fs = require('fs');
const path = require('path');
const dbFilePath = path.join(__dirname, '../db.json');

const readDB = () => JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));
const writeDB = (data) => fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));

const createBook = (req, res) => {
  const { title, author, genre, publicationYear, imageUrl, ISBN, description } = req.body;

  if (!title || !author) {
    return res.status(400).json({ message: 'Title and Author are required' });
  }

  const books = readDB();
  const newBook = {
    id: books.length + 1,
    title,
    author, 
    genre,
    publicationYear,
    imageUrl: imageUrl || 'default-image-url.com/placeholder.jpg',
    ISBN,
    description
  };

  if (books.some((book) => book.ISBN === ISBN)) {
    return res.status(400).json({ message: 'Book with this ISBN already exists' });
  }

  books.push(newBook);
  writeDB(books);
  res.status(201).json(newBook);
};

const getBooks = (req, res) => {
  const books = readDB();
  res.json(books);
};

const getBookById = (req, res) => {
  const books = readDB();
  const book = books.find((book) => book.id === parseInt(req.params.id));
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  res.json(book);
};

const updateBook = (req, res) => {
  const { title, author, genre, publicationYear, imageUrl, ISBN, description } = req.body;
  const books = readDB();
  const bookIndex = books.findIndex((book) => book.id === parseInt(req.params.id));

  if (bookIndex === -1) {
    return res.status(404).json({ message: 'Book not found' });
  }

  const updatedBook = {
    ...books[bookIndex],
    title: title || books[bookIndex].title,
    author: author || books[bookIndex].author,
    genre: genre || books[bookIndex].genre,
    publicationYear: publicationYear || books[bookIndex].publicationYear,
    imageUrl: imageUrl || books[bookIndex].imageUrl,
    ISBN: ISBN || books[bookIndex].ISBN,
    description: description || books[bookIndex].description
  };

  books[bookIndex] = updatedBook;
  writeDB(books);
  res.json(updatedBook);
};

const deleteBook = (req, res) => {
  const books = readDB();
  const bookIndex = books.findIndex((book) => book.id === parseInt(req.params.id));

  if (bookIndex === -1) {
    return res.status(404).json({ message: 'Book not found' });
  }

  books.splice(bookIndex, 1);
  writeDB(books);
  res.json({ message: 'Book deleted' });
};

module.exports = { createBook, getBooks, getBookById, updateBook, deleteBook };
