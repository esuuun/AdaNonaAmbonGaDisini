import React from "react";
import { Star } from "lucide-react";

const GAME_TITLE = "AdaNonaAmbonGaDisini?!";

function GameFooter() {
  return (
    <footer className="absolute bottom-0 left-0 w-full p-4 text-center text-xs text-slate-400 z-10">
      © {new Date().getFullYear()} {GAME_TITLE}. Dibuat dengan{" "}
      <Star size={12} className="inline text-yellow-400 mb-0.5" /> oleh Tim
      Pengembang.
    </footer>
  );
}

export default GameFooter;
