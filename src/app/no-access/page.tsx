// app/no-access/page.tsx
export default function NoAccessPage() {
  return (
    <div className="container mx-auto p-6 text-center">
      <h1 className="text-4xl font-bold mb-4">Acesso Negado</h1>
      <p className="text-lg">Você não tem permissão para acessar esta página.</p>
      <a href="/dashboard" className="text-blue-500 hover:underline">
        Voltar ao Dashboard
      </a>
    </div>
  );
}
