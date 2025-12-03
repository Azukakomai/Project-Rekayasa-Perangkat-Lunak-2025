import { useState } from "react";
import ProjectModal from "../components/ProjectModal";
import Card from "../components/Card";
import { Plus, FilePlus, FolderOpen } from "lucide-react";
import { useProjects } from "../components/ProjectContext";

export default function Project() {
  const { projects, addProject, loading, error } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // NOTE: Your backend defaults new projects to 'draft'. 
  // If we filter only 'selesai' (completed), you won't see your new projects!
  // I have changed this to show ALL projects for testing purposes.
  // You can change it back to: projects.filter((p) => p.status === 'completed') later.
  const displayProjects = projects; 

  if (loading) return <div className="p-6">Loading projects from database...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  // Helper to format currency to Rupiah
  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  return (
    <>
      <div className="p-6 space-y-6">
        <h2 className="text-xl font-semibold mb-4">Projek</h2>

        {/* Top Section: Projek & Prioritisasi */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Projek Card */}
          <Card>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-semibold">Daftar Projek</h3>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1 bg-sky-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-sky-700"
              >
                <Plus size={16} /> Tambah
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border text-sm">
                <thead className="bg-sky-50 text-gray-700">
                  <tr>
                    <th className="px-3 py-2 border text-left">Projek</th>
                    <th className="px-3 py-2 border text-left">Dana</th>
                    <th className="px-3 py-2 border text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-center">
                  {displayProjects.length === 0 ? (
                    <tr>
                      <td className="px-3 py-2 border text-gray-400" colSpan="3">
                        Belum ada projek
                      </td>
                    </tr>
                  ) : (
                    displayProjects.map((p) => (
                      // Use project_id from database as key
                      <tr key={p.project_id || p.id}> 
                        <td className="px-3 py-2 border text-left font-medium">
                          {p.title}
                          <div className="text-xs text-gray-400">{p.location}</div>
                        </td>
                        <td className="px-3 py-2 border text-left">
                           {/* Backend sends 'estimated_budget', not 'dana' */}
                          {p.estimated_budget ? formatRupiah(p.estimated_budget) : "-"}
                        </td>
                        <td className="px-3 py-2 border text-left capitalize">
                          {/* Backend sends 'status' (draft, approved, etc) */}
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            p.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="border-t pt-4 flex items-center justify-between">
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
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700"
              >
                Buat Sekarang
              </button>
            </div>
          </Card>

          {/* Prioritisasi Card */}
          <Card>
            <h3 className="text-base font-semibold mb-3">Prioritisasi</h3>
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border text-sm">
                <thead className="bg-sky-50 text-gray-700">
                  <tr>
                    <th className="px-3 py-2 border text-left">Rank</th>
                    <th className="px-3 py-2 border text-left">Projek</th>
                    <th className="px-3 py-2 border text-left">Dana</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-center">
                  {/* Sort by priority (Backend sends 'priority' field) */}
                  {displayProjects.filter(p => p.priority != null).length === 0 ? (
                     <tr>
                     <td className="px-3 py-2 border text-gray-400" colSpan="3">
                       Belum ada prioritisasi
                     </td>
                   </tr>
                  ) : (
                    displayProjects
                      .filter(p => p.priority != null)
                      .sort((a, b) => a.priority - b.priority)
                      .map(p => (
                        <tr key={p.project_id}>
                          <td className="px-3 py-2 border text-left font-bold">{p.priority}</td>
                          <td className="px-3 py-2 border text-left">{p.title}</td>
                          <td className="px-3 py-2 border text-left">{formatRupiah(p.estimated_budget)}</td>
                        </tr>
                      ))
                  )}
                 
                </tbody>
              </table>
            </div>

            <div className="border-t pt-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-sky-100 p-3 rounded-lg">
                  <FilePlus className="text-sky-600" size={24} />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Buat Projek Sekarang</p>
                  <p className="text-sm text-gray-500">
                    Ajukan proposal dari projek yang telah dibuat
                  </p>
                </div>
              </div>
              <button className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg cursor-not-allowed">
                Buat Proposal
              </button>
            </div>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Proposal">
            <p className="text-gray-700 font-medium">Belum ada proposal</p>
            <p className="text-gray-500 text-sm">Ajukan dana terlebih dahulu</p>
          </Card>

          <Card title="Proposal Terakhir">
            <p className="text-gray-700 font-medium">Belum ada proposal</p>
            <p className="text-gray-500 text-sm">Ajukan dana terlebih dahulu</p>
          </Card>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <ProjectModal
          onClose={() => setIsModalOpen(false)}
          onAddProject={addProject}
        />
      )}
    </>
  );
}