// app/api/users/route.ts
import { NextResponse } from 'next/server';

const BACKEND_URL = 'https://backendsistema.azurewebsites.net/api/users';

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
    ? NextResponse.json({ success: true, users: data })
    : NextResponse.json({ success: false, message: 'Erro ao listar usuários.' }, { status: response.status });
}
