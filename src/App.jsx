import { Routes, Route } from "react-router-dom";

import Signup from "./pages/signup";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Bubble from "./pages/bubble";
import Bible from "./pages/bible";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/bubble" element={<Bubble />} />
      <Route path="/bible" element={<Bible />} />
    </Routes>
  );
}

export default App;