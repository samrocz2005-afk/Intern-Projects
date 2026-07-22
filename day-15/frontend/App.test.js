import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../App";

// 1. Mock child route components or router wrappers if needed to isolate the App shell
jest.mock("../routes/AppRoutes", () => {
  return function DummyRoutes() {
    return <div data-testid="app-routes">App Routes Mounted</div>;
  };
});

describe("App Root Component", () => {
  test("renders without crashing", () => {
    render(<App />);
    
    // Asserts that the App renders its core routing container successfully
    expect(screen.getByTestId("app-routes")).toBeInTheDocument();
  });

  test("contains main container or wrapper element", () => {
    const { container } = render(<App />);
    
    // Verifies the root element is present in the document
    expect(container).toBeDefined();
    expect(container.firstChild).not.toBeNull();
  });
});