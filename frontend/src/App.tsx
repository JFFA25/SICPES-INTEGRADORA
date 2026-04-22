import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register"
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Reservation from "./pages/Reservation";
import Payments from "./pages/Payments";
import Confirm from "./pages/Confirm";
import AdminReservations from "./pages/AdminReservation";
import AdminSettings from "./pages/AdminSettings";
import AdminPayments from "./pages/AdminPayments";
import Error from "./pages/Error";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/confirmado" element={<Confirm />} />
        <Route path="/admin/reservations" element={<AdminReservations />} />
        <Route path="/admin/payments" element={<AdminPayments />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/error" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;