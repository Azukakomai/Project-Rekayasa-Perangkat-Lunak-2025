import React from "react";
import Card from "../components/Card";
import { Button } from "../components/Button";
import { Bell, Download, FileUp } from "lucide-react";
import { PieChart, Pie, Cell } from "recharts";

export default function DanaDesa() {
  const data = [
    { name: "Used", value: 0 },
    { name: "Remaining", value: 100 },
  ];
  const COLORS = ["#0E7C7B", "#E5E7EB"];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-semibold text-gray-800">Dana Desa</h1>
        <div className="flex items-center gap-3">
          <Button className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white">
            <Bell className="w-4 h-4" />
            Nyalakan Notifikasi
          </Button>
          <Button className="bg-gray-200 hover:bg-gray-300 text-gray-800">
            Periode 2 – November 2025
          </Button>
        </div>
      </div>

      {/* Top Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Dana Desa Chart */}
        <div className="w-full min-w-0 h-full">
          <Card className="w-full h-full flex flex-col items-center justify-center py-6 text-center space-y-3">
            <div className="flex justify-center">
              <PieChart width={120} height={120}>
                <Pie
                  data={data}
                  innerRadius={45}
                  outerRadius={60}
                  startAngle={90}
                  endAngle={450}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </div>
            <p className="text-3xl font-bold text-gray-800">0%</p>
            <p className="text-gray-500 text-sm">Sisa Penggunaan Dana</p>
            <p className="text-gray-700 font-semibold text-sm">0 / 150.000.000</p>
          </Card>
        </div>

        {/* Realisasi Periode */}
        <div className="w-full min-w-0 h-full">
          <Card className="w-full h-full p-6 flex flex-col justify-between">
            <h2 className="font-semibold text-gray-800 mb-4">Realisasi Periode</h2>
            <div className="flex justify-between text-gray-600 text-sm flex-1 items-center">
              {["Prioritas", "Sedang", "Menengah", "Bawah"].map((label) => (
                <div key={label} className="flex flex-col items-center">
                  <div className="w-8 h-4 bg-sky-600 mb-1 rounded"></div>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Jadwal Selanjutnya */}
        <div className="w-full min-w-0 h-full">
          <Card className="w-full h-full p-6 flex flex-col">
            <h2 className="font-semibold text-gray-800 mb-4">Jadwal Selanjutnya</h2>
            <div className="overflow-x-auto flex-1">
              <table className="min-w-full border text-sm">
                <thead className="bg-sky-50 text-gray-700">
                  <tr>
                    <th className="px-3 py-2 border text-left">Periode</th>
                    <th className="px-3 py-2 border text-left">Bulan</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-center">
                  {Array(4)
                    .fill(null)
                    .map((_, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="px-3 py-2 border">Periode {idx + 1}</td>
                        <td className="px-3 py-2 border">
                          {["Sept", "Okt", "Nov", "Des"][idx]}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Pembagian Dana Desa */}
        <div className="w-full min-w-0 col-span-1 lg:col-span-2 h-full">
          <Card className="w-full h-full p-6 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-800">Pembagian Dana Desa</h2>
              <Button
                variant="outline"
                className="flex items-center gap-2 text-sky-600 border border-sky-600 hover:bg-sky-50"
              >
                <Download className="w-4 h-4" />
                Unduh
              </Button>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="min-w-full border text-sm">
                <thead className="bg-sky-50 text-gray-700">
                  <tr>
                    <th className="px-3 py-2 border text-left">Periode</th>
                    <th className="px-3 py-2 border text-left">Dana</th>
                    <th className="px-3 py-2 border text-left">Persentase</th>
                    <th className="px-3 py-2 border text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-center">
                  <tr>
                    <td colSpan="4" className="py-4 text-gray-400">
                      Tidak ada data
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Ajukan Dana */}
        <div className="w-full min-w-0 col-span-1 h-full">
          <Card className="w-full h-full p-6 flex flex-col justify-between">
            <h2 className="font-semibold text-gray-800 mb-4">Ajukan Dana</h2>

            <div
              className="flex flex-col items-center justify-center flex-1 border-2 border-dashed border-gray-300 rounded-xl p-6 text-gray-500 hover:border-sky-600 hover:bg-sky-50 transition cursor-pointer"
              onClick={() => document.getElementById("pdfUpload").click()}
            >
              <FileUp className="w-8 h-8 text-sky-600 mb-2" />
              <p className="text-sm mb-1">Seret dan letakkan file PDF</p>
              <p className="text-xs text-gray-400">atau klik untuk memilih file</p>
              <input
                type="file"
                id="pdfUpload"
                accept=".pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    console.log("Uploaded:", file.name);
                  }
                }}
              />
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                className="w-1/2 text-sky-600 border border-sky-600 hover:bg-sky-50"
                onClick={() => document.getElementById("pdfUpload").click()}
              >
                Pilih File
              </Button>
              <Button className="w-1/2 bg-sky-600 hover:bg-sky-700 text-white">
                Ajukan Proposal
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
