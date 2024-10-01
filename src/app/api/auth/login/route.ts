// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';

// URL do endpoint de login do backend local
const BACKEND_URL = 'https://backendsistema.azurewebsites.net/api/users/login';

export async function POST(request: Request) {
  try {
    // Obtém os dados enviados no request (email e senha)
    const { email, password } = await request.json();

    // Faz a requisição ao backend para autenticação
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    // Obtém a resposta do backend
    const data = await response.json();

    // Verifica se o login foi bem-sucedido
    if (response.ok) {
      // Armazenar o token JWT no localStorage, sessionStorage, ou cookies
      // Neste exemplo, estamos retornando o token como parte da resposta
      return NextResponse.json({
        success: true,
        message: 'Login bem-sucedido!',
        token: data.token, // Retorna o token JWT para ser utilizado no frontend
        user: data.user, // Informações do usuário
      });
    } else {
      // Retorna a mensagem de erro do backend
      return NextResponse.json(
        { success: false, message: data.message || 'Credenciais inválidas. Tente novamente.' },
        { status: response.status }
      );
    }
  } catch (error) {
    // Trata erros de conexão ou outros erros inesperados
    return NextResponse.json(
      { success: false, message: 'Erro ao conectar-se ao backend. Tente novamente mais tarde.' },
      { status: 500 }
    );
  }
}
