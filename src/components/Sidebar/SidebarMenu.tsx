// components/Sidebar/SidebarMenu.tsx
"use client";

import React, { useState } from "react";
import {
  FaSignOutAlt,
  FaChartLine,
  FaShoppingBag,
  FaBox,
  FaCog,
  FaCommentDots,
} from "react-icons/fa";
import MenuItem from "./MenuItem";
import { usePathname } from "next/navigation";

interface SidebarMenuProps {
  onLogout: () => void;
  role: string;
  collapsed: boolean;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  onLogout,
  role,
  collapsed,
}) => {
  const pathname = usePathname();
  const [userSubmenuOpen, setUserSubmenuOpen] = useState(false);
  const [orderSubmenuOpen, setOrderSubmenuOpen] = useState(false);
  const [settingsSubmenuOpen, setSettingsSubmenuOpen] = useState(false);

  const toggleUserSubmenu = () => setUserSubmenuOpen(!userSubmenuOpen);
  const toggleOrderSubmenu = () => setOrderSubmenuOpen(!orderSubmenuOpen);
  const toggleSettingsSubmenu = () => setSettingsSubmenuOpen(!settingsSubmenuOpen);

  const menuItems = [
    {
      label: "Dashboard",
      icon: <FaChartLine size={15}/>,
      route: "/dashboard",
    },
    {
      label: "Usuários",
      icon: <FaShoppingBag size={15} />,
      submenu: [
        {
          label: "Perfil",
          route: "/dashboard/profile",
          icon: <FaShoppingBag size={15} />,
        },
        ...(role !== "user"
          ? [
            {
              label: "Contas",
              route: "/dashboard/users",
              icon: <FaShoppingBag size={15} />,
            },
            ]
          : []),
      ],
      submenuOpen: userSubmenuOpen,
      toggleSubmenu: toggleUserSubmenu,
    },
    {
      label: "Ordens de Serviço",
      icon: <FaBox size={15} />,
      submenu: [
        {
          label: "Minhas OS",
          route: "/dashboard/usersorder",
          icon: <FaBox size={15} />,
        },
        ...(role !== "user"
          ? [
              {
                label: "Gerenciar",
                route: "/dashboard/os",
                icon: <FaBox size={15} />,
              },
            ]
          : []),
      ],
      submenuOpen: orderSubmenuOpen,
      toggleSubmenu: toggleOrderSubmenu,
    },
    
    ...(role === "admin"
      ? [
          {
            label: "Configurações",
            icon: <FaCog size={15} />,
            submenu: [
              {
                label: "Configurações Gerais",
                route: "/dashboard/settings",
                icon: <FaCog size={15} />,
              },
              {
                label: "Configurações do Sistema",
                route: "/dashboard/system",
                icon: <FaCog size={15} />,
              },
            ],
            submenuOpen: settingsSubmenuOpen,
            toggleSubmenu: toggleSettingsSubmenu,
          },
        ]
      : []),
  ];

  return (
    <div className="flex flex-col h-full text-white bg-background overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-blue-500 rounded-md flex items-center justify-center">
            <FaChartLine size={24} />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-white">Bem vindo</span>
              <span className="text-sm text-gray-400">Gerenciamento</span>
            </div>
          )}
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 mt-4 ">
        <div className="px-4 text-gray-400 text-xs uppercase">Geral</div>
        <div className="flex flex-col mt-2 space-y-1">
          {menuItems.map((item, index) => (
            <MenuItem
              key={index}
              label={item.label}
              icon={item.icon}
              route={item.route}
              submenu={item.submenu}
              submenuOpen={item.submenuOpen}
              toggleSubmenu={item.toggleSubmenu}
              collapsed={collapsed}
              isActive={item.route ? pathname === item.route : false}
            />
          ))}
        </div>
      </div>

      {/* Account */}
      <div className="mt-4">
        <div className="px-4 text-gray-400 text-xs uppercase">Configurações</div>
        <div className="flex flex-col mt-2 space-y-1">
          <MenuItem
            label="Log out"
            icon={<FaSignOutAlt size={20} />}
            onLogout={onLogout}
            collapsed={collapsed}
            isActive={false}
          />
        </div>
      </div>
    </div>
  );
};

export default SidebarMenu;
