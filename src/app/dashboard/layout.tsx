// components/Layout/DashboardLayout.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import SidebarMenu from "@/components/Sidebar/SidebarMenu";
import MobileMenu from "@/components/Sidebar/MobileMenu";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [role, setRole] = useState<string>("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    router.push("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }

    const storedRole = localStorage.getItem("userRole");
    if (storedRole) {
      setRole(storedRole);
    }

    const storedCollapsed = localStorage.getItem("sidebarCollapsed");
    if (storedCollapsed) {
      setCollapsed(storedCollapsed === "true");
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [router]);

  const toggleCollapsed = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", newState.toString());
  };

  return (
    <div className="min-h-screen flex">
      {!isMobile && (
        <motion.div
          initial={{ width: collapsed ? "5rem" : "16rem" }}
          animate={{ width: collapsed ? "5rem" : "16rem" }}
          transition={{ duration: 0.3 }}
          className="bg-gray-100 shadow-lg flex flex-col justify-between overflow-hidden fixed top-0 left-0 h-full z-50"
        >
          <SidebarMenu onLogout={handleLogout} collapsed={collapsed} role={role} />
          <button
            onClick={toggleCollapsed}
            className="w-full p-4 bg-gray-800 text-white flex justify-center items-center hover:bg-gray-700 transition-colors focus:outline-none"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <FaChevronRight size={16} /> : <FaChevronLeft size={16} />}
          </button>
        </motion.div>
      )}

      {isMobile && <MobileMenu onLogout={handleLogout} role={role} />}

      <div
        className={`flex-1 transition-all duration-300 ${
          !isMobile && collapsed ? "ml-20" : !isMobile ? "ml-64" : "ml-0"
        } bg-gray-100`}
      >
        <div className="flex items-center bg-white p-4 shadow">
          <h1 className="text-2xl font-bold m-0">Dashboard</h1>
        </div>
        <div className="m-4 p-6 bg-white rounded-lg shadow-md">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
