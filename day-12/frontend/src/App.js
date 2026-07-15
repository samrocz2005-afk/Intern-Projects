import { useState } from "react";
import { Layout } from "antd";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Students from "./pages/Students";
import Books from "./pages/Books";

const { Content } = Layout;

function App() {
  const [selectedPage, setSelectedPage] = useState("students");

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar
        selectedKey={selectedPage}
        onMenuClick={setSelectedPage}
      />

      <Layout>
        <Header
          title={
            selectedPage === "students"
              ? "Students"
              : "Library Books"
          }
        />

        <Content
          style={{
            margin: "24px",
            background: "#fff",
            padding: "24px",
            borderRadius: "8px",
          }}
        >
          {selectedPage === "students" ? (
            <Students />
          ) : (
            <Books />
          )}
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;