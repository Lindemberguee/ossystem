// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from "jwt-decode";// Certifique-se de importar assim para obter a função correta

interface DecodedToken {
  exp: number; // Expiration time do token JWT
}

// Função para verificar se o token JWT está expirado
function isTokenExpired(token: string): boolean {
  try {
    const decoded: DecodedToken = jwtDecode<DecodedToken>(token); // Adicione o tipo DecodedToken ao jwtDecode
    const currentTime = Math.floor(Date.now() / 1000); // Tempo atual em segundos
    return decoded.exp < currentTime; // Retorna true se o token estiver expirado
  } catch (error) {
    // Se não for possível decodificar o token, considera-o inválido
    return true;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value || '';

  if (request.nextUrl.pathname === '/login' && token && !isTokenExpired(token)) {
    // Redireciona para o dashboard se o usuário já estiver logado
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!token || isTokenExpired(token)) {
    // Redireciona para login se o token for inválido ou expirado
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Define as rotas que o middleware deve proteger
export const config = {
  matcher: ['/dashboard/:path*'], // Protege todas as rotas do dashboard
};