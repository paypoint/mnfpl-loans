import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import "./App.css";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/second-page" element={<HomePage />} />
    </Routes>
  );
};

export default App;
