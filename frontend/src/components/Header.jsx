import React from "react";

export default function Header() {
  return (
    <header className="flex justify-between items-center px-6 py-4 border-b bg-white">
      <h2 className="text-lg font-semibold">Dashboard</h2>
      <button className="text-sm text-gray-500 border px-3 py-1 rounded-lg">
        Periode 2 - November 2025
      </button>
    </header>
  );
}
