"use client";

import React, { useEffect, useState } from "react";

export default function TermsAndPolicyCard() {
  const [stasiunName, setStasiunName] = useState("Stasiun");

  useEffect(() => {
    const storedNamaStasiun = sessionStorage.getItem("selectedStasiunName");
    if (storedNamaStasiun) {
      setStasiunName(storedNamaStasiun);
    }
  }, []);

  const getStasiunImage = () => {
    switch (stasiunName.toLowerCase()) {
      case "klimatologi":
        return "/KLIMATOLOGI.png";
      case "meteorologi":
        return "/METEOROLOGI.png";
      case "geofisika":
        return "/GEOFISIKA.png";
      default:
        return "/BgLogin.png";
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 sm:px-6 bg-gradient-to-tr from-blue-100 via-white to-blue-200">
      <div className="flex w-full max-w-6xl bg-white rounded-3xl shadow-lg overflow-hidden flex-col md:flex-row transition-all duration-300">
        {/* Gambar kiri */}
        <div className="hidden md:block w-1/2">
          <img
            src={getStasiunImage()}
            alt={`Gedung ${stasiunName}`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Konten kanan */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-center text-blue-900">
          <h1 className="text-3xl font-bold mb-2">Syarat & Ketentuan</h1>
          <p className="text-sm mb-4">
            Dengan mengakses dan menggunakan layanan Buku Tamu Digital BMKG
            Provinsi Bengkulu, Anda dianggap telah membaca, memahami, dan
            menyetujui semua ketentuan berikut:
          </p>

          <ul className="list-disc list-inside text-sm space-y-2 mb-6">
            <li>
              Layanan ini digunakan untuk mencatat kunjungan secara digital.
            </li>
            <li>Pengguna wajib mengisi data secara jujur dan akurat.</li>
            <li>
              BMKG berhak menggunakan data untuk evaluasi layanan dan keperluan
              internal.
            </li>
            <li>
              Kami tidak akan membagikan data kepada pihak ketiga tanpa izin,
              kecuali diwajibkan oleh hukum.
            </li>
            <li>
              Keamanan data dijaga sesuai standar dan dapat diminta penghapusan
              jika diperlukan.
            </li>
            <li>
              Perubahan kebijakan dapat dilakukan sewaktu-waktu dan akan
              diumumkan di situs ini.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mb-2">Kebijakan Privasi</h2>
          <p className="text-sm mb-4">
            Kami mengumpulkan informasi sebagai berikut:
          </p>
          <ul className="list-disc list-inside text-sm space-y-1 mb-4">
            <li>Nama lengkap</li>
            <li>Jabatan / Instansi</li>
            <li>Email & Nomor Telepon</li>
            <li>Tujuan kunjungan & waktu</li>
            <li>Tanda tangan digital (jika tersedia)</li>
          </ul>

          <p className="text-sm">
            Informasi tersebut digunakan hanya untuk kepentingan internal BMKG
            Provinsi Bengkulu, termasuk keperluan statistik, keamanan, dan
            peningkatan pelayanan publik. Anda memiliki hak atas data Anda.
          </p>
        </div>
      </div>
    </div>
  );
}
