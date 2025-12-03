import React from "react";
import { useNavigate } from "react-router-dom";
import { useProjects } from "../components/ProjectContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { projects, loading, error } = useProjects();

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  const totalProjects = projects.length;
  const totalDanaDigunakan = projects.reduce((acc, p) => acc + (parseFloat(p.estimated_budget) || 0), 0);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  return (
    <div className="p-6 space-y-6">
      {totalProjects === 0 && (
        <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg">
          <strong>PENGUMUMAN:</strong> Kamu belum mengisi projek, isi sekarang
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow p-4 rounded-lg">
          <h3 className="font-semibold mb-3">Progress Pengembangan</h3>
          <div className="flex justify-between text-center">
            <div>
              <p className="text-2xl font-bold text-sky-700">{totalProjects}</p>
              <p className="text-gray-500 text-sm">Projek</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-sky-700">0</p>
              <p className="text-gray-500 text-sm">Task List</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-sky-700">{formatRupiah(totalDanaDigunakan)}</p>
              <p className="text-gray-500 text-sm">Dana Digunakan</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Dana Tersisa</h3>
            <button className="text-sm text-sky-600 border px-2 py-1 rounded-lg">
              Lihat
            </button>
          </div>
          <p className="text-gray-500 text-sm">Periode 2 - November 2025</p>
          <div className="mt-2 h-3 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-3 bg-sky-500 w-[0%]"></div>
          </div>
          <p className="text-right text-sm text-gray-500 mt-1">0%</p>
        </div>
      </div>

      <div className="bg-white shadow p-4 rounded-lg text-center">
        <h3 className="font-semibold mb-2">Projek Teratas</h3>
        <p className="text-gray-500 mb-4">
          Buat projek untuk pengajuan proposal sekarang
        </p>
        <button
          onClick={() => navigate("/project")}
          className="bg-sky-600 text-white px-5 py-2 rounded-lg"
        >
          Buat Sekarang
        </button>
      </div>
    </div>
  );
}
