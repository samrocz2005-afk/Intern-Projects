const fs = require("fs/promises");
const path = require("path");

const DB_PATH = path.join(__dirname, "../data/db.json");

const readDatabase = async () => {
  const data = await fs.readFile(DB_PATH, "utf-8");

  return JSON.parse(data);
};

const writeDatabase = async (data) => {
  await fs.writeFile(
    DB_PATH,
    JSON.stringify(data, null, 2)
  );
};

const getBooks = async () => {
  const db = await readDatabase();

  return db.books;
};


const getBookById = async (id) => {
  const db = await readDatabase();

  const book = db.books.find(
    (book) => book.id === Number(id)
  );

  if (!book) {
    throw new Error("Book not found");
  }

  return book;
};


const createBook = async (bookData) => {
  const db = await readDatabase();

  const newBook = {
    id: Date.now(),
    ...bookData
  };


  db.books.push(newBook);

  await writeDatabase(db);

  return newBook;
};


const updateBook = async (id, bookData) => {
  const db = await readDatabase();

  const index = db.books.findIndex(
    (book) => book.id === Number(id)
  );


  if (index === -1) {
    throw new Error("Book not found");
  }


  db.books[index] = {
    ...db.books[index],
    ...bookData
  };


  await writeDatabase(db);

  return db.books[index];
};

const deleteBook = async (id) => {
  const db = await readDatabase();


  const index = db.books.findIndex(
    (book) => book.id === Number(id)
  );


  if (index === -1) {
    throw new Error("Book not found");
  }


  const deletedBook = db.books.splice(index, 1);


  await writeDatabase(db);

  return deletedBook[0];
};


module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};