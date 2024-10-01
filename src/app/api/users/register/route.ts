// app/api/users/register/route.ts
import { NextResponse } from 'next/server';

// URL do backend para registrar usuários
const BACKEND_URL = 'http://localhost:5000/api/users/register';

export async function POST(request: Request) {
  try {
    // Obtém os dados enviados no corpo da requisição
    const userData = await request.json();

    // Faz a requisição POST para o backend
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.ok) {
      // Se o registro for bem-sucedido, retorna a resposta
      return NextResponse.json({ success: true, message: 'Usuário criado com sucesso!', user: data });
    } else {
      return NextResponse.json(
        { success: false, message: data.message || 'Erro ao criar usuário.' },
        { status: response.status }
      );
    }
  } catch (error) {
    // Retorna uma mensagem de erro se houver falha
    return NextResponse.json(
      { success: false, message: 'Erro ao conectar-se ao backend.' },
      { status: 500 }
    );
  }
}
