// app/dashboard/settings/page.tsx
'use client';
import { Switch, Card } from 'antd';
import { useState } from 'react';

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);

  // Simula a mudança de preferência
  const toggleDarkMode = (checked: boolean) => {
    setDarkMode(checked);
    // Aqui, você poderia salvar essa preferência no backend
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Configurações</h2>
      <Card>
        <div className="flex items-center justify-between">
          <span>Modo Escuro</span>
          <Switch checked={darkMode} onChange={toggleDarkMode} />
        </div>
      </Card>
    </div>
  );
}
