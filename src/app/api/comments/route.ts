// app/api/comments/route.ts

import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://backendsistema.azurewebsites.net/api/comments';

export async function GET(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  console.log('GET /api/comments called'); // Debug log

  if (!token) {
    console.error('Token not provided'); // Error log
    return NextResponse.json(
      { success: false, message: 'Token não fornecido.' },
      { status: 401 }
    );
  }

  try {
    console.log('Fetching all comments from backend'); // Debug log

    const response = await fetch(BACKEND_URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(`Backend response status: ${response.status}`); // Debug log

    if (response.ok) {
      const data = await response.json();
      console.log('Comments fetched successfully'); // Debug log
      return NextResponse.json({ success: true, comments: data });
    } else {
      const errorData = await response.json();
      console.error('Error fetching comments:', errorData); // Error log
      return NextResponse.json(
        { success: false, message: errorData.message || 'Erro ao obter comentários.' },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Error fetching comments:', error); // Error log
    return NextResponse.json(
      { success: false, message: 'Erro interno no servidor.' },
      { status: 500 }
    );
  }
}
