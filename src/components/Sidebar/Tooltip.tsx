// components/Tooltip.tsx
"use client";

import React from "react";

interface TooltipProps {
  children: React.ReactNode;
  text: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, text }) => {
  return (
    <div className="relative group">
      {children}
      <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-sm rounded px-2 py-1 whitespace-nowrap z-10">
        {text}
      </div>
    </div>
  );
};

export default Tooltip;
