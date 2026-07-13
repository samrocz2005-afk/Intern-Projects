import { ConfigProvider, theme } from "antd";
import { useMemo } from "react";

import AppRoutes from "./routes/AppRoutes";
import useUIStore from "./zustand/uiStore";

function App() {
  const { darkMode } = useUIStore();

  const antdTheme = useMemo(
    () => ({
      algorithm: darkMode
        ? theme.darkAlgorithm
        : theme.defaultAlgorithm,

      token: {
        colorPrimary: "#635FC7",
        borderRadius: 8,
        fontFamily: "Plus Jakarta Sans, sans-serif",
      },
    }),
    [darkMode]
  );

  return (
    <ConfigProvider theme={antdTheme}>
      <AppRoutes />
    </ConfigProvider>
  );
}

export default App;