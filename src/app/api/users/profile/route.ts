// app/api/users/profile/route.ts
import { NextResponse } from 'next/server';

const BACKEND_URL = 'https://backendsistema.azurewebsites.net/api/users/profile';

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
    ? NextResponse.json({ success: true, user: data })
    : NextResponse.json({ success: false, message: 'Erro ao buscar perfil.' }, { status: response.status });
}

export async function PUT(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  const userData = await request.json();

  if (!token) {
    return NextResponse.json({ success: false, message: 'Token não fornecido.' }, { status: 401 });
  }

  const response = await fetch(BACKEND_URL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  return response.ok
    ? NextResponse.json({ success: true, message: 'Perfil atualizado!', user: data })
    : NextResponse.json({ success: false, message: 'Erro ao atualizar perfil.' }, { status: response.status });
}
