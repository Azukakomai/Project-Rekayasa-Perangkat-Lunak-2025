import { Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center bg-white p-4 border-b">
      <h2 className="text-lg font-semibold">Dashboard</h2>
      <div className="flex items-center gap-4">
        <span className="text-sky-700 text-sm">Periode 2 - November 2025</span>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/pengaturan")}
            className="p-2 border rounded-lg hover:bg-gray-100"
          >
            <Settings size={18} />
          </button>
          <button
            onClick={() => navigate("/login")}
            className="p-2 border rounded-lg hover:bg-gray-100"
          >
            <User size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
