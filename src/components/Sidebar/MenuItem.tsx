// components/MenuItem.tsx
"use client";

import React from "react";
import { FaArrowAltCircleRight, FaArrowAltCircleUp, FaArrowCircleDown, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useRouter, usePathname } from "next/navigation"; // Importando usePathname
import { motion } from "framer-motion";
import Tooltip from "./Tooltip";

interface SubmenuItem {
  label: string;
  route: string;
  icon: React.ReactNode;
}

interface MenuItemProps {
  label: string;
  icon: React.ReactNode;
  route?: string;
  submenu?: SubmenuItem[];
  submenuOpen?: boolean;
  toggleSubmenu?: () => void;
  collapsed: boolean;
  isActive: boolean;
  onLogout?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  label,
  icon,
  route,
  submenu,
  submenuOpen,
  toggleSubmenu,
  collapsed,
  isActive,
  onLogout,
}) => {
  const router = useRouter();
  const pathname = usePathname(); // Obtendo o pathname atual

  const handleClick = () => {
    if (onLogout) {
      onLogout();
    } else if (route) {
      router.push(route);
    }
  };

  if (submenu) {
    return (
      <div>
        <Tooltip text={label}>
          <button
            className={`text-sm font-extralight flex items-center justify-between p-4 hover:bg-gray-700 transition-colors w-full focus:outline-none ${
              submenuOpen ? "bg-zinc-700" : ""
            }`}
            onClick={toggleSubmenu}
            aria-haspopup="true"
            aria-expanded={submenuOpen}
            aria-controls={`${label}-submenu`}
          >
            <div className="flex items-center">
              {icon}
              {!collapsed && <span className="ml-2">{label}</span>}
            </div>
            {!collapsed && (
              <span className="text-blue-400">
                {submenuOpen ? <FaArrowAltCircleUp aria-hidden="true" /> : <FaArrowAltCircleRight  aria-hidden="true" />}
              </span>
            )}
          </button>
        </Tooltip>
        {!collapsed && submenu && (
          <motion.div
            id={`${label}-submenu`}
            initial="collapsed"
            animate={submenuOpen ? "open" : "collapsed"}
            variants={{
              open: {
                opacity: 1,
                height: "auto",
                transition: { duration: 0.3, ease: "easeInOut" },
              },
              collapsed: {
                opacity: 0,
                height: 0,
                transition: { duration: 0.3, ease: "easeInOut" },
              },
            }}
            className="overflow-hidden"
          >
            <div className="flex flex-col">
              {submenu.map((subItem, index) => (
                <Tooltip key={index} text={subItem.label}>
                  <button
                    className={`flex items-center pl-12 pr-4 py-2 hover:bg-gray-700 transition-colors w-full focus:outline-none text-sm font-extralight${
                      isActive && subItem.route === pathname
                        ? "bg-blue-500" // Cor alterada para "blue-500"
                        : ""
                    }`}
                    onClick={() => router.push(subItem.route)}
                    aria-current={isActive && subItem.route === pathname ? "page" : undefined}
                  >
                    {subItem.icon}
                    {!collapsed && <span className="ml-2">{subItem.label}</span>}
                  </button>
                </Tooltip>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <Tooltip text={label}>
      <button
        className={`flex items-center p-4 hover:bg-gray-700 transition-colors w-full focus:outline-none ${
          isActive ? "bg-blue-500" : "" // Cor alterada para "blue-500"
        }`}
        onClick={handleClick}
        aria-current={isActive ? "page" : undefined}
      >
        {icon}
        {!collapsed && <span className="ml-2">{label}</span>}
      </button>
    </Tooltip>
  );
};

export default MenuItem;
