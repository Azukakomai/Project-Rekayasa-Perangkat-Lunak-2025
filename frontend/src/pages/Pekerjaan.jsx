import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FolderOpen } from "lucide-react";
import Card from "../components/Card";
import { useProjects } from "../components/ProjectContext";

export default function Pekerjaan() {
  const { projects } = useProjects();

  const totalProjek = projects.length;
  const totalDana = projects.reduce(
    (acc, p) => acc + (parseInt(p.dana) || 0),
    0
  );

  // Daftar bulan dari JAN–JUL
  const bulanList = ["JAN", "FEB", "MAR", "APR", "MEI", "JUN", "JUL"];

  // Buat data chart berdasar jumlah projek per bulan
  const chartData = bulanList.map((bulan) => {
    const jumlah = projects.filter((p) => p.bulan === bulan).length;
    return {
      bulan,
      projek: jumlah,
      danaKeluar: jumlah * 5,
      danaMasuk: jumlah * 7,
    };
  });

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold mb-4">Pekerjaan</h2>

      {/* Bagian Atas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Pengembangan */}
        <Card title="Progress Pengembangan">
          <div className="flex justify-between text-center">
            <div>
              <p className="text-2xl font-bold text-sky-700">{totalProjek}</p>
              <p className="text-gray-500 text-sm">Projek</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-sky-700">
                {totalProjek > 0 ? "75%" : "0%"}
              </p>
              <p className="text-gray-500 text-sm">Task List</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-sky-700">
                Rp {totalDana.toLocaleString()}
              </p>
              <p className="text-gray-500 text-sm">Dana Digunakan</p>
            </div>
          </div>
        </Card>

        {/* Data Proyeksi */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold">Data Proyeksi</h3>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-green-500 rounded-sm"></span> Projek
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-blue-500 rounded-sm"></span> Dana Keluar
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-yellow-400 rounded-sm"></span> Dana Masuk
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="h-60 relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="bulan" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 20]} ticks={[5, 10, 15, 20]} />
                <Tooltip />
                <Line type="monotone" dataKey="projek" stroke="#22c55e" strokeWidth={2} />
                <Line type="monotone" dataKey="danaKeluar" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="danaMasuk" stroke="#facc15" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Laporan Pertanggungjawaban */}
      <Card title="Laporan Pertanggungjawaban">
        <p className="text-gray-700 mb-2">
          Belum ada laporan pertanggungjawaban yang diajukan.
        </p>
        <p className="text-gray-500 text-sm mb-4">
          Silakan buat laporan baru untuk mencatat hasil kegiatan.
        </p>
        <button className="bg-sky-600 text-white px-5 py-2 rounded-lg hover:bg-sky-700">
          Buat Laporan Sekarang
        </button>
      </Card>

      {/* List Semua Projek */}
      <Card>
        <div className="flex items-center justify-between border-b pb-3 mb-3">
          <h3 className="font-semibold text-base">List Semua Projek</h3>
        </div>

        {projects.length === 0 ? (
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="bg-sky-100 p-3 rounded-lg">
                <FolderOpen className="text-sky-600" size={24} />
              </div>
              <div>
                <p className="font-medium text-gray-800">Buat Projek Sekarang</p>
                <p className="text-sm text-gray-500">
                  Mulai ajukan proposal untuk pengembangan
                </p>
              </div>
            </div>
            <button className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700">
              Buat Sekarang
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-800">{p.title}</p>
                  <p className="text-sm text-gray-500">
                    Dana: Rp {p.dana || "-"} | Status: {p.status || "belum selesai"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}







