import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";

// Mute console output during test runs
beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  console.log.mockRestore();
  console.error.mockRestore();
});

// 1. Mock API calls from ../api/bookApi
const mockGetBooks = jest.fn();
const mockCreateBook = jest.fn();
const mockUpdateBook = jest.fn();
const mockDeleteBook = jest.fn();

jest.mock("../api/bookApi", () => ({
  getBooks: (...args) => mockGetBooks(...args),
  createBook: (...args) => mockCreateBook(...args),
  updateBook: (...args) => mockUpdateBook(...args),
  deleteBook: (...args) => mockDeleteBook(...args),
}));

// 2. Mock Auth Hook & ROLES with dynamic user object
let mockUser = { role: "ADMIN" };
jest.mock("../hooks/useAuth", () => ({
  useAuth: () => ({ user: mockUser }),
}));

jest.mock("../utils/constants", () => ({
  ROLES: { ADMIN: "ADMIN", MEMBER: "MEMBER", USER: "USER" },
}));

// 3. Mock Ant Design UI components
jest.mock("antd", () => {
  const React = require("react");

  const Search = ({ onSearch, allowClear, ...props }) => (
    <div>
      <input
        data-testid="search-input"
        onChange={(e) => onSearch && onSearch(e.target.value)}
      />
      <button onClick={() => onSearch && onSearch("React")}>Trigger Search</button>
    </div>
  );

  const Input = ({ ...props }) => <input {...props} />;
  Input.Search = Search;

  const Modal = ({ children, open, onCancel, title }) => {
    if (!open) return null;
    return (
      <div data-testid="mock-modal">
        <h2>{title}</h2>
        <button onClick={onCancel} data-testid="modal-cancel-btn">
          Cancel
        </button>
        {children}
      </div>
    );
  };

  return {
    Input,
    Modal,
    Button: ({ children, onClick, ...props }) => (
      <button onClick={onClick} {...props}>
        {children}
      </button>
    ),
    Space: ({ children }) => <div>{children}</div>,
    message: {
      success: jest.fn(),
      error: jest.fn(),
    },
  };
});

// 4. Mock Antd Icons
jest.mock("@ant-design/icons", () => ({
  PlusOutlined: () => <span>plus-icon</span>,
}));

// 5. Mock Child Components (BookTable & BookForm)
jest.mock("../components/Books/BookTable", () => {
  const React = require("react");
  return function MockBookTable({ books, loading, pagination, onTableChange, onEdit, onDelete }) {
    return (
      <div data-testid="mock-book-table">
        <span data-testid="book-count">{books ? books.length : 0}</span>
        <button
          data-testid="trigger-page-change"
          onClick={() => onTableChange({ current: 2 })}
        >
          Next Page
        </button>
        <button
          data-testid="trigger-edit"
          onClick={() => onEdit({ _id: "123", title: "Test Book" })}
        >
          Edit Book
        </button>
        <button
          data-testid="trigger-delete"
          onClick={() => onDelete("123")}
        >
          Delete Book
        </button>
      </div>
    );
  };
});

jest.mock("../components/Books/BookForm", () => {
  const React = require("react");
  return function MockBookForm({ onSubmit, initialValues }) {
    return (
      <form
        data-testid="mock-book-form"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ title: "Submitted Book Title" });
        }}
      >
        <button type="submit" data-testid="submit-form-btn">
          Submit Form
        </button>
      </form>
    );
  };
});

// 6. Import Component AFTER mocks
import Books from "../../../../day-16/frontend/src/pages/Books";
import { message } from "antd";

const sampleApiResponse = {
  data: {
    books: [
      { _id: "123", title: "Clean Code", author: "Robert Martin" },
      { _id: "456", title: "Refactoring", author: "Martin Fowler" },
    ],
    total: 2,
  },
};

describe("Books Page - 100% Coverage Suite", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUser = { role: "ADMIN" }; // Reset user role before each test
    mockGetBooks.mockResolvedValue(sampleApiResponse);
  });

  test("Fetches and displays books on initial render", async () => {
    await act(async () => {
      render(<Books />);
    });

    await waitFor(() => {
      expect(mockGetBooks).toHaveBeenCalledWith(1, 10, "");
      expect(screen.getByTestId("book-count").textContent).toBe("2");
    });
  });

  test("Handles API failure on initial fetch (Default error fallback)", async () => {
    mockGetBooks.mockRejectedValueOnce(new Error("Network Error"));

    await act(async () => {
      render(<Books />);
    });

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith("Failed to load books");
    });
  });

  test("Triggers search and updates page parameter", async () => {
    await act(async () => {
      render(<Books />);
    });

    const searchBtn = screen.getByText("Trigger Search");

    await act(async () => {
      fireEvent.click(searchBtn);
    });

    await waitFor(() => {
      expect(mockGetBooks).toHaveBeenCalledWith(1, 10, "React");
    });
  });

  test("Handles table pagination changes", async () => {
    await act(async () => {
      render(<Books />);
    });

    const nextPageBtn = screen.getByTestId("trigger-page-change");

    await act(async () => {
      fireEvent.click(nextPageBtn);
    });

    await waitFor(() => {
      expect(mockGetBooks).toHaveBeenCalledWith(2, 10, "");
    });
  });

  test("Opens modal in 'Add Book' mode and submits successfully", async () => {
    mockCreateBook.mockResolvedValueOnce({ success: true });

    await act(async () => {
      render(<Books />);
    });

    const addBtn = screen.getByRole("button", { name: /add book/i });
    await act(async () => {
      fireEvent.click(addBtn);
    });

    expect(screen.getByRole("heading", { name: "Add Book" })).toBeTruthy();

    const submitBtn = screen.getByTestId("submit-form-btn");
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    await waitFor(() => {
      expect(mockCreateBook).toHaveBeenCalledWith({ title: "Submitted Book Title" });
      expect(message.success).toHaveBeenCalledWith("Book created successfully");
    });
  });

  test("Opens modal in 'Edit Book' mode and updates successfully", async () => {
    mockUpdateBook.mockResolvedValueOnce({ success: true });

    await act(async () => {
      render(<Books />);
    });

    const editBtn = screen.getByTestId("trigger-edit");
    await act(async () => {
      fireEvent.click(editBtn);
    });

    expect(screen.getByRole("heading", { name: "Edit Book" })).toBeTruthy();

    const submitBtn = screen.getByTestId("submit-form-btn");
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    await waitFor(() => {
      expect(mockUpdateBook).toHaveBeenCalledWith("123", { title: "Submitted Book Title" });
      expect(message.success).toHaveBeenCalledWith("Book updated successfully");
    });
  });

  test("Handles form submission errors with custom response message", async () => {
    mockCreateBook.mockRejectedValueOnce({
      response: { data: { message: "Validation error" } },
    });

    await act(async () => {
      render(<Books />);
    });

    const addBtn = screen.getByRole("button", { name: /add book/i });
    await act(async () => {
      fireEvent.click(addBtn);
    });

    const submitBtn = screen.getByTestId("submit-form-btn");
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith("Validation error");
    });
  });

  test("Handles form submission errors without response message (Fallback branch)", async () => {
    mockCreateBook.mockRejectedValueOnce(new Error("Generic error"));

    await act(async () => {
      render(<Books />);
    });

    const addBtn = screen.getByRole("button", { name: /add book/i });
    await act(async () => {
      fireEvent.click(addBtn);
    });

    const submitBtn = screen.getByTestId("submit-form-btn");
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith("Operation failed");
    });
  });

  test("Deletes a book successfully", async () => {
    mockDeleteBook.mockResolvedValueOnce({ success: true });

    await act(async () => {
      render(<Books />);
    });

    const deleteBtn = screen.getByTestId("trigger-delete");
    await act(async () => {
      fireEvent.click(deleteBtn);
    });

    await waitFor(() => {
      expect(mockDeleteBook).toHaveBeenCalledWith("123");
      expect(message.success).toHaveBeenCalledWith("Book deleted successfully");
    });
  });

  test("Handles deletion failure", async () => {
    mockDeleteBook.mockRejectedValueOnce(new Error("Delete failed"));

    await act(async () => {
      render(<Books />);
    });

    const deleteBtn = screen.getByTestId("trigger-delete");
    await act(async () => {
      fireEvent.click(deleteBtn);
    });

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith("Delete failed");
    });
  });

  test("Closes modal when Cancel is clicked", async () => {
    await act(async () => {
      render(<Books />);
    });

    const addBtn = screen.getByRole("button", { name: /add book/i });
    await act(async () => {
      fireEvent.click(addBtn);
    });

    const cancelBtn = screen.getByTestId("modal-cancel-btn");
    await act(async () => {
      fireEvent.click(cancelBtn);
    });

    expect(screen.queryByTestId("mock-modal")).toBeNull();
  });

  test("Hides 'Add Book' button when user is a standard USER role", async () => {
    mockUser = { role: "USER" };

    await act(async () => {
      render(<Books />);
    });

    expect(screen.queryByRole("button", { name: /add book/i })).toBeNull();
  });

  test("Handles empty API payload gracefully with default fallbacks", async () => {
    mockGetBooks.mockResolvedValueOnce({});

    await act(async () => {
      render(<Books />);
    });

    await waitFor(() => {
      expect(screen.getByTestId("book-count").textContent).toBe("0");
    });
  });

  test("Triggers catch block when API returns response error data", async () => {
    mockGetBooks.mockRejectedValueOnce({
      response: { data: "Backend Error Details" },
    });

    await act(async () => {
      render(<Books />);
    });

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith("Failed to load books");
    });
  });
});