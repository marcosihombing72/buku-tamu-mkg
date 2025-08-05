"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export default function CardForm2() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    Nama_Depan_Pengunjung: "",
    Nama_Belakang_Pengunjung: "",
    Email_Pengunjung: "",
    No_Telepon_Pengunjung: "",
    id_stasiun: "",
  });

  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [stasiunName, setStasiunName] = useState("");

  useEffect(() => {
    const storedIdStasiun = sessionStorage.getItem("selectedStasiunId");
    const storedNamaStasiun = sessionStorage.getItem("selectedStasiunName");

    if (storedIdStasiun) {
      setFormData((prev) => ({ ...prev, id_stasiun: storedIdStasiun }));
    }

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

  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const isValidPhone = (phone: string) => {
    const regex = /^[0-9]{8,15}$/;
    return regex.test(phone);
  };

  const isFormValid = () =>
    formData.Nama_Depan_Pengunjung.trim() &&
    formData.Nama_Belakang_Pengunjung.trim() &&
    formData.Email_Pengunjung.trim() &&
    formData.No_Telepon_Pengunjung.trim() &&
    formData.id_stasiun &&
    isEmailValid &&
    isPhoneValid;

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "Email_Pengunjung") setIsEmailValid(isValidEmail(value));
    if (name === "No_Telepon_Pengunjung") setIsPhoneValid(isValidPhone(value));

    if (name === "Nama_Depan_Pengunjung" && value.length >= 2) {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/pengunjung/search`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ keyword: value }),
          }
        );
        const data = await res.json();
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Fetch error:", err);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else if (name === "Nama_Depan_Pengunjung") {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (pengunjung: any) => {
    setFormData({
      Nama_Depan_Pengunjung: pengunjung.Nama_Depan_Pengunjung,
      Nama_Belakang_Pengunjung: pengunjung.Nama_Belakang_Pengunjung,
      Email_Pengunjung: pengunjung.Email_Pengunjung,
      No_Telepon_Pengunjung: pengunjung.No_Telepon_Pengunjung,
      id_stasiun: formData.id_stasiun,
    });
    setIsEmailValid(isValidEmail(pengunjung.Email_Pengunjung));
    setIsPhoneValid(isValidPhone(pengunjung.No_Telepon_Pengunjung));
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    sessionStorage.setItem("dataBukuTamu", JSON.stringify(formData));
    sessionStorage.setItem("selectedStasiunId", formData.id_stasiun);
    sessionStorage.setItem("selectedStasiunName", stasiunName);
    router.push("/formbukutamu");
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 sm:px-6">
      <div className="flex w-full max-w-5xl bg-white rounded-3xl shadow-lg overflow-hidden flex-col md:flex-row">
        {/* Gambar kiri */}
        <div className="hidden md:block w-1/2">
          <img
            src={getStasiunImage()}
            alt={`Gedung ${stasiunName}`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Form kanan */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">
            Yuk, Isi Buku Tamu Dulu!
          </h1>
          <p className="text-sm text-blue-800 mb-8">
            Data kunjungan kamu membantu kami memberikan pelayanan yang lebih
            baik dan tertata.
          </p>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <label className="text-sm text-blue-800 font-medium mb-1">
                  Nama Depan
                </label>
                <input
                  type="text"
                  name="Nama_Depan_Pengunjung"
                  value={formData.Nama_Depan_Pengunjung}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-blue-300 rounded-xl text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-blue-300 rounded-md mt-1 max-h-40 overflow-y-auto">
                    {suggestions.map((item) => (
                      <li
                        key={item.ID_Pengunjung}
                        onClick={() => handleSelectSuggestion(item)}
                        className="px-4 py-2 hover:bg-blue-100 text-blue-800 cursor-pointer text-sm"
                      >
                        {item.Nama_Depan_Pengunjung}{" "}
                        {item.Nama_Belakang_Pengunjung}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex-1">
                <label className="text-sm text-blue-800 font-medium mb-1">
                  Nama Belakang
                </label>
                <input
                  type="text"
                  name="Nama_Belakang_Pengunjung"
                  value={formData.Nama_Belakang_Pengunjung}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-blue-300 rounded-xl text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-blue-800 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                name="Email_Pengunjung"
                value={formData.Email_Pengunjung}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${
                  isEmailValid ? "border-blue-300" : "border-red-500"
                } rounded-xl text-blue-800 focus:outline-none focus:ring-2 ${
                  isEmailValid ? "focus:ring-blue-500" : "focus:ring-red-500"
                }`}
                required
              />
              {!isEmailValid && (
                <p className="text-red-600 text-sm mt-1">
                  Format email tidak valid.
                </p>
              )}
            </div>

            <div>
              <label className="text-sm text-blue-800 font-medium mb-1">
                No. Telepon
              </label>
              <input
                type="tel"
                name="No_Telepon_Pengunjung"
                value={formData.No_Telepon_Pengunjung}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${
                  isPhoneValid ? "border-blue-300" : "border-red-500"
                } rounded-xl text-blue-800 focus:outline-none focus:ring-2 ${
                  isPhoneValid ? "focus:ring-blue-500" : "focus:ring-red-500"
                }`}
                required
              />
              {!isPhoneValid && (
                <p className="text-red-600 text-sm mt-1">
                  Nomor telepon hanya boleh angka (8–15 digit).
                </p>
              )}
            </div>

            <div>
              <label className="text-sm text-blue-800 font-medium mb-1">
                Stasiun
              </label>
              <input
                type="text"
                value={stasiunName}
                readOnly
                className="w-full px-4 py-2 border border-blue-300 rounded-xl text-blue-800 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="flex justify-end gap-4 mt-4">
              <Button
                type="button"
                text="Kembali"
                onClick={() => router.push("/beranda")}
                stylebutton="bg-blue-900 text-white font-semibold py-2 px-4 rounded-xl hover:bg-blue-800 transition w-full sm:w-auto"
              />
              <Button
                type="submit"
                text="Lanjutkan"
                disabled={!isFormValid()}
                stylebutton={`bg-blue-900 text-white font-semibold py-2 px-4 rounded-xl hover:bg-blue-800 transition w-full sm:w-auto ${
                  !isFormValid() ? "opacity-50 cursor-not-allowed" : ""
                }`}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
