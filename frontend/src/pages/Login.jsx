import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);
        window.location.href = "/"; // reload to trigger App.js state
      } else {
        setError("Login failed: No token received.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.error || "An error occurred during login.");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://github.com/arlecchi/image-hosting/blob/6c50b9c530b9b88448c8d492a0cc70d8ae6a7633/loginpage.jpg?raw=true')",
      }}
    >
      {/* Login Card */}
      <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-10 w-full max-w-md text-center border border-gray-200">
        {/* Logo */}
        <img
          src="https://github.com/arlecchi/image-hosting/blob/6c50b9c530b9b88448c8d492a0cc70d8ae6a7633/prpllogo.png?raw=true"
          alt="NusaDana Logo"
          className="mx-auto mb-4 w-16"
        />

        <p className="text-sm text-gray-600 mb-1">
          Untuk Infrastruktur Desa Lebih Maju
        </p>
        <h2 className="text-lg font-semibold mb-6">
          Selamat Datang, Masuk Sekarang
        </h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-400 outline-none"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-400 outline-none"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-700 transition"
          >
            Masuk Sekarang
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-4">
          Belum punya akun?{" "}
          <Link to="/register" className="text-sky-600 hover:underline">
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
