import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import React from "react";

// Mute non-critical console logs during test execution
beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  console.log.mockRestore();
  console.error.mockRestore();
});

// 1. Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

// 2. Comprehensive Antd Mock (covers layout wrappers & sub-components)
jest.mock("antd", () => {
  const React = require("react");

  const Form = ({ children, onFinish }) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (onFinish) onFinish({ email: "user@example.com", password: "password123" });
      }}
    >
      {children}
    </form>
  );
  Form.Item = ({ children }) => <div>{children}</div>;
  Form.useForm = () => [{ resetFields: jest.fn(), setFieldsValue: jest.fn() }];

  const Input = ({ onChange, ...props }) => (
    <input onChange={onChange} {...props} data-testid="email-input" />
  );
  Input.Password = ({ onChange, ...props }) => (
    <input type="password" onChange={onChange} {...props} data-testid="password-input" />
  );

  return {
    Form,
    Input,
    Button: ({ children, htmlType, loading }) => (
      <button type={htmlType || "button"} disabled={loading}>
        {children}
      </button>
    ),
    Card: ({ children }) => <div>{children}</div>,
    Layout: Object.assign(({ children }) => <div>{children}</div>, {
      Header: ({ children }) => <header>{children}</header>,
      Content: ({ children }) => <main>{children}</main>,
      Footer: ({ children }) => <footer>{children}</footer>,
    }),
    Flex: ({ children }) => <div>{children}</div>,
    Space: ({ children }) => <div>{children}</div>,
    Row: ({ children }) => <div>{children}</div>,
    Col: ({ children }) => <div>{children}</div>,
    Checkbox: ({ children }) => <label><input type="checkbox" />{children}</label>,
    Typography: {
      Title: ({ children }) => <h1>{children}</h1>,
      Text: ({ children }) => <span>{children}</span>,
      Paragraph: ({ children }) => <p>{children}</p>,
      Link: ({ children }) => <a>{children}</a>,
    },
    message: {
      success: jest.fn(),
      error: jest.fn(),
    },
  };
});

// 3. Mock Antd Icons
jest.mock("@ant-design/icons", () => ({
  LockOutlined: () => <span>lock-icon</span>,
  UserOutlined: () => <span>user-icon</span>,
  MailOutlined: () => <span>mail-icon</span>,
}));

// 4. Mock Auth Hook
const mockLogin = jest.fn();
jest.mock("../hooks/useAuth", () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

// 5. Import Login AFTER mocks
import Login from "../../../../day-16/frontend/src/pages/Login";
import { message } from "antd";

describe("Login Page - 100% Coverage Suite", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Renders login form elements properly", async () => {
    await act(async () => {
      render(<Login />);
    });

    expect(screen.getByRole("button")).toBeTruthy();
    expect(screen.getByTestId("email-input")).toBeTruthy();
    expect(screen.getByTestId("password-input")).toBeTruthy();
  });

  test("Handles successful login and navigates to homepage", async () => {
    mockLogin.mockResolvedValueOnce({ success: true });

    await act(async () => {
      render(<Login />);
    });

    const submitBtn = screen.getByRole("button");

    await act(async () => {
      fireEvent.click(submitBtn);
    });

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  test("Handles failed login attempt and displays error notification", async () => {
    mockLogin.mockRejectedValueOnce(new Error("Invalid credentials"));

    await act(async () => {
      render(<Login />);
    });

    const submitBtn = screen.getByRole("button");

    await act(async () => {
      fireEvent.click(submitBtn);
    });

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      expect(message.error).toHaveBeenCalled();
    });
  });
});