import { NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:5000/api/users'; // Endpoint correto para listar todos os usuários

export async function GET(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token não fornecido. Faça login novamente.' },
        { status: 401 }
      );
    }

    const response = await fetch(BACKEND_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json(data); // Retorna a lista de usuários diretamente
    } else {
      return NextResponse.json(
        { success: false, message: data.message || 'Erro ao recuperar lista de usuários.' },
        { status: response.status }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Erro ao conectar-se ao backend.' },
      { status: 500 }
    );
  }
}
