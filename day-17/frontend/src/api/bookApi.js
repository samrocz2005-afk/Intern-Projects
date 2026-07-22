import api from "./axios";

// ====================================
// Get Books (Search + Pagination)
// ====================================
export const getBooks = async (
  page = 1,
  limit = 10,
  search = ""
) => {
  const response = await api.get("/books", {
    params: {
      page,
      limit,
      search,
    },
  });

  return response.data;
};

// ====================================
// Get Single Book
// ====================================
export const getBookById = async (bookId) => {
  const response = await api.get(`/books/${bookId}`);
  return response.data;
};

// ====================================
// Create Book
// ====================================
export const createBook = async (bookData) => {
  const response = await api.post("/books", bookData);
  return response.data;
};

// ====================================
// Update Book
// ====================================
export const updateBook = async (bookId, bookData) => {
  const response = await api.put(
    `/books/${bookId}`,
    bookData
  );

  return response.data;
};

// ====================================
// Delete Book
// ====================================
export const deleteBook = async (bookId) => {
  const response = await api.delete(`/books/${bookId}`);
  return response.data;
};