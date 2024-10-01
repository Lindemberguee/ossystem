"use client";
import Image from "next/image";

interface LogoProps {
  collapsed: boolean;
  username: string;
}

const Logo: React.FC<LogoProps> = ({ collapsed, username }) => {
  return (
    <div className="flex items-center justify-center p-4 bg-black border-b border-b-gray-600">
      {!collapsed ? (
        <div className="flex items-center space-x-2">
          <Image
            src="https://apisistema.blob.core.windows.net/apiservice/9391712.png"
            alt="Logo"
            width={50}
            height={50}
            priority
          />
          <p className="text-white font-bold tracking-wide">
            Bem Vindo <span className="text-green-500">{username}</span>
          </p>
        </div>
      ) : (
        <Image
          src="https://apisistema.blob.core.windows.net/apiservice/9391712.png"
          alt="Logo"
          width={50}
          height={50}
          priority
        />
      )}
    </div>
  );
};

export default Logo;
