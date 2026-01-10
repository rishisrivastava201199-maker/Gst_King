import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";     // ✅ Staff/User Dashboard
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default redirect to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Dashboards */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/superadmin" element={<SuperAdminDashboard />} />
        <Route path="/user" element={<UserDashboard />} />   {/* ✅ New Route */}
        <Route path="/user/*" element={<UserDashboard />} />
      


        {/* 404 Page */}
        <Route
          path="*"
          element={
            <div style={{ padding: "50px", textAlign: "center" }}>
              <h1>404 - Page Not Found</h1>
              <p>
                Try:{" "}
                <a href="/login">Login</a> | <a href="/admin">Admin</a> |{" "}
                <a href="/superadmin">SuperAdmin</a> | <a href="/user">User</a>
              </p>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;