// app/api/users/[id]/route.ts
import { NextResponse } from 'next/server';

const BACKEND_URL = 'https://backendsistema.azurewebsites.net/api/users';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  const userData = await request.json();

  if (!token) {
    return NextResponse.json({ success: false, message: 'Token não fornecido.' }, { status: 401 });
  }

  const response = await fetch(`${BACKEND_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  return response.ok
    ? NextResponse.json({ success: true, message: 'Usuário atualizado!', user: data })
    : NextResponse.json({ success: false, message: data.message || 'Erro ao atualizar usuário.' }, { status: response.status });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ success: false, message: 'Token não fornecido.' }, { status: 401 });
  }

  const response = await fetch(`${BACKEND_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.ok
    ? NextResponse.json({ success: true, message: 'Usuário removido com sucesso!' })
    : NextResponse.json({ success: false, message: 'Erro ao remover usuário.' }, { status: response.status });
}
