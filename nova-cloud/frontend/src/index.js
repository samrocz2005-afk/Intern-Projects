import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import store from "./redux/store";

import "./styles/global.css";
import "./styles/layout.css";

const theme = {
  token: {
    colorPrimary: "#1677ff",
    borderRadius: 8,
    colorBgLayout: "#f5f7fa",

    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  components: {
    Layout: {
      bodyBg: "#f5f7fa",
      headerBg: "#ffffff",
      siderBg: "#001529",
    },

    Menu: {
      darkItemBg: "#001529",
      darkSubMenuItemBg: "#000c17",
      darkItemSelectedBg: "#1677ff",
    },

    Card: {
      borderRadiusLG: 10,
    },

    Button: {
      borderRadius: 8,
    },

    Input: {
      borderRadius: 8,
    },

    Select: {
      borderRadius: 8,
    },
  },
};

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider theme={theme}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  </React.StrictMode>
);