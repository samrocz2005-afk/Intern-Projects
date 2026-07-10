import { lazy, Suspense } from "react";

import Loader from "./components/Loader";

import "antd/dist/reset.css";
import "./App.css";

// Lazy Load Home Page
const Home = lazy(() => import("./pages/Home"));

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Home />
    </Suspense>
  );
}

export default App;