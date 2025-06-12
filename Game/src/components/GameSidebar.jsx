import { ChevronDown, Edit3, Music, Play, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

function GameSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-[#1e1e3f] z-50 transition-transform duration-300 ease-in-out shadow-xl ${
          isOpen ? "transform-none" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4">
          <button
            onClick={onClose}
            className="text-white hover:text-yellow-400 transition-colors"
          >
            <X size={28} />
          </button>
        </div>

        <div className="p-4">
          <h3 className="text-white text-lg font-bold mb-4">
            PERMAINAN SONGTRIVIA
          </h3>

          {/* Kuis Musik Section */}
          <div className="mb-4">
            <div
              className="flex items-center gap-3 py-2 text-white cursor-pointer hover:bg-[#2a2a50] rounded-lg p-2"
              onClick={() => handleNavigate("/genre")}
            >
              <Music size={24} className="text-blue-400" />
              <div>
                <h4 className="font-semibold">Kuis Musik</h4>
                <p className="text-sm text-gray-300">
                  Uji pengetahuan musik Anda
                </p>
              </div>
            </div>
          </div>

          {/* Membuat Section */}
          <div className="mb-4">
            <div className="flex items-center gap-3 py-2 text-white cursor-pointer hover:bg-[#2a2a50] rounded-lg p-2">
              <Edit3 size={24} className="text-yellow-400" />
              <div>
                <h4 className="font-semibold">Membuat</h4>
                <p className="text-sm text-gray-300">
                  Uji pengetahuan musik Anda
                </p>
              </div>
            </div>
          </div>

          {/* Harmonies Section */}
          <div className="mb-4">
            <div className="flex items-center gap-3 py-2 text-white cursor-pointer hover:bg-[#2a2a50] rounded-lg p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-purple-400"
              >
                <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12l-4-4Z"></path>
                <path d="M16 12l4 4"></path>
                <path d="M17.5 7.5c.74.74 1.25 1.73 1.43 2.8"></path>
                <path d="M22 12c0 1.4-.3 2.7-.8 3.9"></path>
              </svg>
              <div>
                <h4 className="font-semibold">Harmonies</h4>
                <p className="text-sm text-gray-300">
                  Permainan koneksi musik terbaik
                </p>
              </div>
            </div>
          </div>

          {/* Semua Permainan Section */}
          <div className="mb-8">
            <div
              className="flex items-center gap-3 py-2 text-white cursor-pointer hover:bg-[#2a2a50] rounded-lg p-2"
              onClick={() => handleNavigate("/")}
            >
              <Play size={24} className="text-green-400" />
              <div>
                <h4 className="font-semibold">Semua Permainan</h4>
                <p className="text-sm text-gray-300">
                  Lihat koleksi permainan lengkap
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-4">
            <h3 className="text-white text-lg font-bold mb-4">GENRES</h3>
            <div className="space-y-2">
              <div
                className="flex items-center gap-3 py-2 text-white cursor-pointer hover:bg-[#2a2a50] rounded-lg p-2"
                onClick={() => handleNavigate("/genre")}
              >
                <span className="text-sm text-gray-300">Semua Genre</span>
                <ChevronDown size={16} className="ml-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default GameSidebar;
