// controllers/bookController.js

import bookService from "../services/bookService.js";

import {
  successResponse,
} from "../utils/response.js";



export const createBook = async (
  req,
  res,
  next
) => {

  try {


    const {
      title,
      author,
      category,
      description,
      publishedYear,
    } = req.body;



    if (
      !title ||
      !author ||
      !category ||
      !description ||
      !publishedYear
    ) {

      return res.status(400).json({
        success: false,
        message: "All book fields are required",
      });

    }



    const book =
      await bookService.createBook(
        req.body,
        req.user.id
      );



    return successResponse(
      res,
      "Book created successfully",
      book,
      201
    );



  } catch (error) {

    next(error);

  }

};





export const getBooks = async (
  req,
  res,
  next
) => {

  try {


    const books =
      await bookService.getBooks(
        req.query
      );



    return successResponse(
      res,
      "Books fetched successfully",
      books
    );



  } catch (error) {

    next(error);

  }

};





export const getBookById = async (
  req,
  res,
  next
) => {

  try {


    const book =
      await bookService.getBookById(
        req.params.id
      );



    return successResponse(
      res,
      "Book fetched successfully",
      book
    );



  } catch (error) {

    next(error);

  }

};





export const updateBook = async (
  req,
  res,
  next
) => {

  try {


    const book =
      await bookService.updateBook(
        req.params.id,
        req.body,
        req.user.id
      );



    return successResponse(
      res,
      "Book updated successfully",
      book
    );



  } catch (error) {

    next(error);

  }

};





export const deleteBook = async (
  req,
  res,
  next
) => {

  try {


    const result =
      await bookService.deleteBook(
        req.params.id
      );



    return successResponse(
      res,
      result.message
    );



  } catch (error) {

    next(error);

  }

};