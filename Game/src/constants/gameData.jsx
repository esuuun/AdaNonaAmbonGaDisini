import React from "react";
import {
  AudioLines,
  Guitar,
  HandMetal,
  MicVocal,
  Music,
  Music2,
} from "lucide-react";

// Game Constants
export const GAME_TITLE = "AdaNonaAmbonGaDisini?!";
export const TOTAL_ROUNDS = 5; // Jumlah total pertanyaan per game
export const TIME_PER_QUESTION = 15; // Detik untuk menjawab
export const POINTS_PER_CORRECT_ANSWER = 10;

// Mock Data - Ganti dengan data lagu Anda atau API
export const genres = [
  {
    id: "pop",
    name: "POP",
    icon: <Music size={40} className="text-pink-400" />,
    songs: [
      {
        title: "Lagu Pop Satu",
        artist: "Artis Pop A",
        options: ["Lagu Pop Satu", "Lagu Lain", "Judul A", "Judul B"],
        correct: 0,
        audioSrc:
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        hint: "Penyanyinya suka warna pink.",
      },
      {
        title: "Lagu Pop Dua",
        artist: "Artis Pop B",
        options: ["Lagu Pop Dua", "Salah Lagi", "Opsi C", "Opsi D"],
        correct: 0,
        audioSrc:
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        hint: "Lagu ini sering diputar di radio.",
      },
    ],
  },
  {
    id: "rock",
    name: "ROCK",
    icon: <HandMetal size={40} className="text-red-400" />,
    songs: [
      {
        title: "Lagu Rock Keren",
        artist: "Band Rock X",
        options: ["Lagu Rock Keren", "Bukan Ini", "Salah Dong", "Pasti Ini"],
        correct: 0,
        audioSrc:
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        hint: "Band ini terkenal dengan gitarisnya.",
      },
    ],
  },
  {
    id: "dangdut",
    name: "DANGDUT",
    icon: <AudioLines size={40} className="text-green-400" />,
    songs: [
      {
        title: "Goyang Asik",
        artist: "Penyanyi Dangdut Z",
        options: [
          "Goyang Asik",
          "Terlalu Santai",
          "Kurang Goyang",
          "Asik Banget",
        ],
        correct: 0,
        audioSrc:
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        hint: "Judulnya mengandung kata 'Goyang'.",
      },
    ],
  },
  {
    id: "jazz",
    name: "JAZZ",
    icon: <Music2 size={40} className="text-blue-400" />,
    songs: [],
  },
  {
    id: "hiphop",
    name: "RAP & HIP-HOP",
    icon: <MicVocal size={40} className="text-yellow-400" />,
    songs: [],
  },
  {
    id: "country",
    name: "COUNTRY",
    icon: <Guitar size={40} className="text-orange-400" />,
    songs: [],
  },
];
