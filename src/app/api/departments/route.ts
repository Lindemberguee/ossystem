// app/api/departments/route.ts
import { NextResponse } from 'next/server';

// URL do backend para manipulação de departamentos
const BACKEND_URL = 'http://localhost:5000/api/departments';

// Função para buscar departamentos (GET)
export async function GET(request: Request) {
  try {
    // Faz a requisição GET para o backend
    const response = await fetch(BACKEND_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: request.headers.get('Authorization') || '', // Passa o token JWT se houver
      },
    });

    const data = await response.json();

    // Retorna a lista de departamentos se a requisição for bem-sucedida
    if (response.ok) {
      return NextResponse.json(data); // Assumimos que o backend retorna um array de departamentos
    } else {
      return NextResponse.json({ success: false, message: data.message || 'Erro ao buscar departamentos.' }, { status: response.status });
    }
  } catch (error) {
    // Retorna erro genérico em caso de falha
    return NextResponse.json({ success: false, message: 'Erro ao conectar-se ao backend.' }, { status: 500 });
  }
}

// Função para criar um novo departamento (POST)
export async function POST(request: Request) {
  try {
    // Obtém os dados enviados no corpo da requisição
    const departmentData = await request.json();

    // Faz a requisição POST para o backend
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: request.headers.get('Authorization') || '', // Passa o token JWT
      },
      body: JSON.stringify(departmentData),
    });

    const data = await response.json();

    // Retorna a resposta com o novo departamento se a criação for bem-sucedida
    if (response.ok) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json({ success: false, message: data.message || 'Erro ao criar departamento.' }, { status: response.status });
    }
  } catch (error) {
    // Retorna erro genérico em caso de falha
    return NextResponse.json({ success: false, message: 'Erro ao conectar-se ao backend.' }, { status: 500 });
  }
}
