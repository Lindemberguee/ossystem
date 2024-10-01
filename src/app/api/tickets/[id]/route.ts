// app/api/tickets/[id]/route.ts
import { NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:5000/api/tickets';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ success: false, message: 'Token não fornecido.' }, { status: 401 });
  }

  const response = await fetch(`${BACKEND_URL}/${params.id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  return response.ok
    ? NextResponse.json({ success: true, ticket: data })
    : NextResponse.json({ success: false, message: 'Erro ao buscar ticket.' }, { status: response.status });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ success: false, message: 'Token não fornecido.' }, { status: 401 });
  }

  const response = await fetch(`${BACKEND_URL}/${params.id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // const data = await response.json();

  return response.ok
    ? NextResponse.json({ success: true, message: 'Ticket deletado com sucesso!' })
    : NextResponse.json({ success: false, message: 'Erro ao deletar ticket.' }, { status: response.status });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  const ticketData = await request.json();

  if (!token) {
    return NextResponse.json({ success: false, message: 'Token não fornecido.' }, { status: 401 });
  }

  const response = await fetch(`${BACKEND_URL}/${params.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(ticketData),
  });

  const data = await response.json();

  return response.ok
    ? NextResponse.json({ success: true, message: 'Ticket atualizado com sucesso!', ticket: data })
    : NextResponse.json({ success: false, message: 'Erro ao atualizar ticket.' }, { status: response.status });
}

