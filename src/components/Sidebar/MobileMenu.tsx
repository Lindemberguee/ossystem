// components/Sidebar/MobileMenu.tsx
"use client";

import React, { useState } from "react";
import { FaTimes, FaBars } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import SidebarMenu from "./SidebarMenu";

interface MobileMenuProps {
  onLogout: () => void;
  role: string;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ onLogout, role }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div>
      <button
        onClick={toggleMenu}
        className="p-4 bg-gray-900 text-white fixed top-4 left-4 z-50 rounded-md focus:outline-none"
        aria-label="Toggle menu"
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 w-64 h-full bg-gray-900 text-white z-40 shadow-lg overflow-hidden"
          >
            <SidebarMenu onLogout={onLogout} collapsed={false} role={role} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileMenu;
