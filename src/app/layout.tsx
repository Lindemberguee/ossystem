// app/layout.tsx
'use client';
import 'antd/dist/reset.css'; // Importação dos estilos do Ant Design
import { ConfigProvider } from 'antd';
import { ReactNode } from 'react';
import './globals.css'; // Importação dos estilos globais

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gray-100">
        <ConfigProvider>
          {children}
        </ConfigProvider>
      </body>
    </html>
  );
}
