import React from "react";

export function Button({ children, onClick, className = "", variant }) {
  let base =
    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150";

  let styles =
    variant === "outline"
      ? "border border-gray-300 text-gray-700 hover:bg-gray-100"
      : "bg-sky-700 hover:bg-sku-800 text-white";

  return (
    <button onClick={onClick} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  );
}
