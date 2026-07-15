import { useEffect, useState } from "react";
import { Button, Input, Space, message } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";

import BookTable from "../components/BookTable";
import BookForm from "../components/BookForm";

import {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
} from "../services/api";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);

  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);

  const [selectedBook, setSelectedBook] = useState(null);

  const loadBooks = async () => {
    try {
      setLoading(true);

      const response = await getBooks();

      setBooks(response.data.data);
      setFilteredBooks(response.data.data);
    } catch (error) {
      message.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleSubmit = async (values) => {
    try {
      if (selectedBook) {
        await updateBook(selectedBook.id, values);
        message.success("Book updated");
      } else {
        await createBook(values);
        message.success("Book created");
      }

      setOpen(false);
      setSelectedBook(null);

      loadBooks();
    } catch (error) {
      message.error("Operation failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBook(id);

      message.success("Book deleted");

      loadBooks();
    } catch (error) {
      message.error("Delete failed");
    }
  };

  const handleSearch = (value) => {
    const keyword = value.toLowerCase();

    const filtered = books.filter((book) =>
      book.title.toLowerCase().includes(keyword)
    );

    setFilteredBooks(filtered);
  };

  return (
    <>
      <Space
        style={{
          marginBottom: 20,
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Input
          placeholder="Search Book"
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
          onChange={(e) => handleSearch(e.target.value)}
        />

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setSelectedBook(null);
            setOpen(true);
          }}
        >
          Add Book
        </Button>
      </Space>

      <BookTable
        books={filteredBooks}
        loading={loading}
        onEdit={(book) => {
          setSelectedBook(book);
          setOpen(true);
        }}
        onDelete={handleDelete}
      />

      <BookForm
        open={open}
        onCancel={() => {
          setOpen(false);
          setSelectedBook(null);
        }}
        onSubmit={handleSubmit}
        initialValues={selectedBook}
      />
    </>
  );
};

export default Books;