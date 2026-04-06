import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register"
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Reservation from "./pages/Reservation";
import Payments from "./pages/Payments";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/payments" element={<Payments />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;