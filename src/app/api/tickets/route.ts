// app/api/tickets/route.ts
import { NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:5000/api/tickets';

export async function GET(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ success: false, message: 'Token não fornecido.' }, { status: 401 });
  }

  const response = await fetch(BACKEND_URL, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  return response.ok
    ? NextResponse.json({ success: true, tickets: data })
    : NextResponse.json({ success: false, message: 'Erro ao listar tickets.' }, { status: response.status });
}
// Função para criar ticket (POST)
export async function POST(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  const ticketData = await request.json();

  if (!token) {
    return NextResponse.json({ success: false, message: 'Token não fornecido.' }, { status: 401 });
  }

  // Validação básica para garantir que os campos obrigatórios estão presentes
  if (!ticketData.title || !ticketData.description || !ticketData.priority) {
    return NextResponse.json({ success: false, message: 'Campos obrigatórios não fornecidos.' }, { status: 400 });
  }

  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(ticketData),
    });

    const data = await response.json();

    return response.ok
      ? NextResponse.json({ success: true, message: 'Ticket criado com sucesso!', ticket: data })
      : NextResponse.json({ success: false, message: 'Erro ao criar ticket.' }, { status: response.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Erro ao conectar ao servidor.' }, { status: 500 });
  }
}