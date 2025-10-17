"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth";
import { Power, PowerOff } from "lucide-react";
import { toast } from "react-toastify";

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      if (!AuthService.isAuthenticated()) {
        router.push("/login");
        return;
      }

      try {
        const res = await AuthService.me();
        setUser(res.data);
      } catch (error) {
        toast.error("Sesi berakhir, silakan login kembali.");
        AuthService.logout();
        router.push("/login");
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      toast.success("Berhasil logout!");
      router.push("/login");
    } catch (error) {
      toast.error("Gagal logout");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <nav className="bg-white border-b border-gray-200 shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-sm md:text-xl font-semibold text-gray-800">
          Task Management System
        </h1>

        <div className="flex items-center gap-4">
          <span className="text-sm md:text-base text-gray-700 font-medium">
            Selamat datang, {user ? user.name : "Loading..."}
          </span>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition hover:cursor-pointer"
          >
            <Power size={18} />
          </button>
        </div>
      </nav>

      <main className="flex-1 md:p-6">{children}</main>
    </div>
  );
}
