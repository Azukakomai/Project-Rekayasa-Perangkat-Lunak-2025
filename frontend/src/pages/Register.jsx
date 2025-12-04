import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Register({ onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
        role: "villager", // Hard-coding role for now
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        onRegister(response.data.user);
      } else {
        setError("Registration succeeded, but no token was received. Please log in.");
      }
    } catch (err) {
      setError(
        err.response?.data?.error || "An error occurred during registration."
      );
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://github.com/arlecchi/image-hosting/blob/6c50b9c530b9b88448c8d492a0cc70d8ae6a7633/signuppage.jpg?raw=true')",
      }}
    >
      {/* Register Card */}
      <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-10 w-full max-w-md text-center border border-gray-200">
        {/* Logo */}
        <img
          src="https://github.com/arlecchi/image-hosting/blob/6c50b9c530b9b88448c8d492a0cc70d8ae6a7633/prpllogo.png?raw=true"
          alt="NusaDana Logo"
          className="mx-auto mb-4 w-16"
        />

        <p className="text-sm text-gray-600 mb-1">
          Bersama Kami Bangun Desamu
        </p>
        <h2 className="text-lg font-semibold mb-6">Mulai Daftar Sekarang</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Nama Lengkap"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-400 outline-none"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-400 outline-none"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            name="password"
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
            Daftar Sekarang
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-4">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-sky-600 hover:underline">
            Masuk Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
