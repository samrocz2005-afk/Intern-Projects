// src/pages/Books.jsx

import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Modal,
  Space,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

import {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
} from "../api/bookApi";

import BookTable from "../components/Books/BookTable";
import BookForm from "../components/Books/BookForm";

import { useAuth } from "../hooks/useAuth";
import { ROLES } from "../utils/constants";

const { Search } = Input;

const Books = () => {
  const { user } = useAuth();

  const canManageBooks =
    user?.role === ROLES.ADMIN ||
    user?.role === ROLES.MEMBER;


  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const limit = 10;

  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);



  useEffect(() => {
    fetchBooks();
  }, [page, search]);



  const fetchBooks = async () => {
    setLoading(true);

    try {

      const response = await getBooks(
        page,
        limit,
        search
      );


      console.log("Books API Response:", response);


      setBooks(
        response?.data?.books || []
      );


      setTotal(
        response?.data?.total || 0
      );


    } catch (error) {

      console.error(
        "Fetch Books Error:",
        error.response?.data || error.message
      );

      message.error("Failed to load books");

    } finally {

      setLoading(false);

    }
  };




  const handleSubmit = async (values) => {

    try {

      if (selectedBook) {

        await updateBook(
          selectedBook._id,
          values
        );

        message.success(
          "Book updated successfully"
        );


      } else {


        await createBook(values);

        message.success(
          "Book created successfully"
        );

      }


      setOpen(false);
      setSelectedBook(null);

      fetchBooks();


    } catch (error) {

      message.error(
        error?.response?.data?.message ||
        "Operation failed"
      );

    }

  };





  const handleDelete = async (id) => {

    try {

      await deleteBook(id);

      message.success(
        "Book deleted successfully"
      );

      fetchBooks();


    } catch (error) {

      message.error(
        "Delete failed"
      );

    }

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

        <Search
          placeholder="Search books..."
          allowClear
          onSearch={(value) => {
            setPage(1);
            setSearch(value);
          }}
          style={{
            width: 300,
          }}
        />


        {canManageBooks && (

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

        )}


      </Space>




      <BookTable

        books={books}

        loading={loading}


        pagination={{
          current: page,
          pageSize: limit,
          total: total,
        }}


        onTableChange={(pagination) => {

          setPage(
            pagination.current
          );

        }}


        onEdit={(book) => {

          setSelectedBook(book);

          setOpen(true);

        }}


        onDelete={handleDelete}

      />






      <Modal

        open={open}

        footer={null}

        destroyOnClose

        title={
          selectedBook
            ? "Edit Book"
            : "Add Book"
        }


        onCancel={() => {

          setOpen(false);

          setSelectedBook(null);

        }}

      >

        <BookForm

          initialValues={selectedBook}

          onSubmit={handleSubmit}

          loading={loading}

        />


      </Modal>


    </>
  );
};


export default Books;