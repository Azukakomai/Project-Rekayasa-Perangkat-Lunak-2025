import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import Project from "./pages/Project";
import DanaDesa from "./pages/DanaDesa";
import Pekerjaan from "./pages/Pekerjaan";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ProjectProvider } from "./components/ProjectContext";

export default function App() {
  const [user, setUser] = useState(null);

  // Check login status when app loads
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log("storedUser:", storedUser);
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        console.log("user from localStorage:", user);
        setUser(user);
      } catch (error) {
        // If parsing fails, the stored user is invalid.
        // Clear the invalid item from localStorage.
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Handle login (from Login or Register pages)
  const handleLogin = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <ProjectProvider>
      <Router>
        {user ? (
          // If logged in, show main dashboard layout
          <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar onLogout={handleLogout} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
              <Topbar user={user} onLogout={handleLogout} />
              <main className="p-6 flex-1">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/project" element={<Project />} />
                  <Route path="/danadesa" element={<DanaDesa />} />
                  <Route path="/pekerjaan" element={<Pekerjaan />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>
            </div>
          </div>
        ) : (
          // If not logged in, show login/register routes
          <Routes>
            <Route
              path="/login"
              element={
                <Login
                  onLogin={(data) => {
                    handleLogin(data);
                  }}
                />
              }
            />
            <Route
              path="/register"
              element={
                <Register
                  onRegister={(data) => {
                    handleLogin(data);
                  }}
                />
              }
            />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </Router>
    </ProjectProvider>
  );
}
