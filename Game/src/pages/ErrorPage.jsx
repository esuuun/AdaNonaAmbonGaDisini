import React from "react";
import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";

function ErrorPage({ message = "Halaman yang Anda cari tidak ditemukan." }) {
  const navigate = useNavigate();

  const handleNavigateHome = () => {
    navigate("/");
  };

  return (
    <div className="text-center p-8 flex flex-col items-center justify-center min-h-[calc(100vh-12rem)]">
      <XCircle size={64} className="mx-auto text-red-500 mb-4" />
      <h2 className="text-2xl font-semibold mb-4">Oops! Terjadi Kesalahan</h2>
      <p className="text-slate-300 mb-6">{message}</p>
      <button
        onClick={handleNavigateHome}
        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors shadow-lg"
      >
        Kembali ke Halaman Utama
      </button>
    </div>
  );
}

export default ErrorPage;
