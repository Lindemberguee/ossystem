// app/api/slas/route.ts
import { NextResponse } from 'next/server';

const BACKEND_URL = 'https://backendsistema.azurewebsites.net/api/slas';

// Função para listar SLAs (GET)
export async function GET(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ success: false, message: 'Token não fornecido.' }, { status: 401 });
  }

  try {
    const response = await fetch(BACKEND_URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      mode: 'no-cors', 
    });

    const data = await response.json();

    return response.ok
      ? NextResponse.json({ success: true, slas: data })
      : NextResponse.json({ success: false, message: 'Erro ao listar SLAs.' }, { status: response.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Erro ao conectar ao servidor.' }, { status: 500 });
  }
}

// Função para criar uma nova SLA (POST)
export async function POST(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  const slaData = await request.json();

  if (!token) {
    return NextResponse.json({ success: false, message: 'Token não fornecido.' }, { status: 401 });
  }

  if (!slaData.name || !slaData.priority || !slaData.responseTime || !slaData.resolutionTime) {
    return NextResponse.json({ success: false, message: 'Campos obrigatórios não fornecidos.' }, { status: 400 });
  }

  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(slaData),
    });

    const data = await response.json();

    return response.ok
      ? NextResponse.json({ success: true, message: 'SLA criada com sucesso!', sla: data })
      : NextResponse.json({ success: false, message: 'Erro ao criar SLA.' }, { status: response.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Erro ao conectar ao servidor.' }, { status: 500 });
  }
}
