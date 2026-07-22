import Book from "../models/Book.js";


// ===============================
// Create Book
// ===============================
const createBook = async (
  bookData,
  userId
) => {

  return await Book.create({

    ...bookData,

    createdBy: userId,

  });

};




// ===============================
// Get All Books
// Pagination + Search + Populate
// ===============================
const getBooks = async ({
  page = 1,
  limit = 10,
  search = "",
}) => {


  const query = {};



  if (search) {

    query.$or = [

      {
        title: {
          $regex: search,
          $options: "i",
        },
      },


      {
        author: {
          $regex: search,
          $options: "i",
        },
      },


      {
        category: {
          $regex: search,
          $options: "i",
        },
      },


      {
        description: {
          $regex: search,
          $options: "i",
        },
      },

    ];

  }




  const skip =
    (Number(page) - 1) *
    Number(limit);




  const books =
    await Book.find(query)

      .populate(
        "createdBy",
        "username email"
      )

      .populate(
        "updatedBy",
        "username email"
      )

      .skip(skip)

      .limit(Number(limit))

      .sort({
        createdAt: -1,
      });




  const total =
    await Book.countDocuments(query);



  return {

    total,

    page: Number(page),

    totalPages:
      Math.ceil(
        total / Number(limit)
      ),

    books,

  };

};





// ===============================
// Get Book By ID
// ===============================
const getBookById = async (
  id
) => {


  const book =
    await Book.findById(id)

      .populate(
        "createdBy",
        "username email"
      )

      .populate(
        "updatedBy",
        "username email"
      );



  if (!book) {

    throw new Error(
      "Book not found"
    );

  }



  return book;

};






// ===============================
// Update Book
// ===============================
const updateBook = async (
  id,
  data,
  userId
) => {


  const book =
    await Book.findByIdAndUpdate(

      id,

      {
        ...data,

        updatedBy: userId,
      },

      {
        new: true,

        runValidators: true,
      }

    );



  if (!book) {

    throw new Error(
      "Book not found"
    );

  }



  return book;

};






// ===============================
// Delete Book
// ===============================
const deleteBook = async (
  id
) => {


  const book =
    await Book.findByIdAndDelete(
      id
    );



  if (!book) {

    throw new Error(
      "Book not found"
    );

  }



  return {

    message:
      "Book deleted successfully",

  };

};





export default {

  createBook,

  getBooks,

  getBookById,

  updateBook,

  deleteBook,

};