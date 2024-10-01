// app/api/slas/[id]/route.ts
import { NextResponse } from 'next/server';

const BACKEND_URL = 'https://backendsistema.azurewebsites.net/api/slas';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  const slaData = await request.json();

  if (!token) {
    return NextResponse.json({ success: false, message: 'Token não fornecido.' }, { status: 401 });
  }

  if (!slaData.name || !slaData.priority || !slaData.responseTime || !slaData.resolutionTime) {
    return NextResponse.json({ success: false, message: 'Campos obrigatórios não fornecidos.' }, { status: 400 });
  }

  try {
    const response = await fetch(`${BACKEND_URL}/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      mode: 'no-cors', 
      body: JSON.stringify(slaData),
    });

    const data = await response.json();

    return response.ok
      ? NextResponse.json({ success: true, message: 'SLA atualizada com sucesso!', sla: data })
      : NextResponse.json({ success: false, message: 'Erro ao atualizar SLA.' }, { status: response.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Erro ao conectar ao servidor.' }, { status: 500 });
  }
}
