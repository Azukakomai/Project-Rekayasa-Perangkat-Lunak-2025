import React from "react";
import {
  Home,
  Folder,
  TrendingUp,
  Monitor,
  Settings,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar({ onLogout }) {
  const navItem =
    "flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-sky-100 transition w-full";
  const activeClass = "bg-sky-600 text-white hover:bg-sky-700";

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user"); // clear user session
    if (onLogout) onLogout(); // update App.js state
    navigate("/login"); // redirect to login page
  };

  return (
    <aside className="w-64 bg-white shadow-md flex flex-col justify-between">
      {/* Top nav */}
      <div>
        <div className="text-xl font-semibold p-4 border-b">NusaDana</div>
        <nav className="mt-4 space-y-1 flex flex-col">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeClass : ""}`
            }
          >
            <Home size={18} /> Halaman Utama
          </NavLink>

          <NavLink
            to="/project"
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeClass : ""}`
            }
          >
            <Folder size={18} /> Project
          </NavLink>

          <NavLink
            to="/danadesa"
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeClass : ""}`
            }
          >
            <TrendingUp size={18} /> Dana Desa
          </NavLink>

          <NavLink
            to="/pekerjaan"
            className={({ isActive }) =>
              `${navItem} ${isActive ? activeClass : ""}`
            }
          >
            <Monitor size={18} /> Pekerjaan
          </NavLink>
        </nav>
      </div>

      {/* Bottom nav */}
      <div className="p-4 border-t space-y-2 flex flex-col">
        <button className={navItem} onClick={() => navigate("/pengaturan")}>
          <Settings size={18} /> Pengaturan
        </button>

        <button className={navItem} onClick={handleLogout}>
          <LogOut size={18} /> Keluar
        </button>
      </div>
    </aside>
  );
}
