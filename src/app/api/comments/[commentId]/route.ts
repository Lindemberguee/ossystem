// app/api/comments/[commentId]/route.ts

import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://backendsistema.azurewebsites.net/api/comments';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json(
      { success: false, message: 'Token não fornecido.' },
      { status: 401 }
    );
  }

  try {
    const response = await fetch(`${BACKEND_URL}/${params.commentId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: data.message || 'Comentário excluído com sucesso!',
      });
    } else {
      return NextResponse.json(
        { success: false, message: data.message || 'Erro ao excluir comentário.' },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Erro ao excluir comentário:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno no servidor.' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  const commentData = await request.json();

  if (!token) {
    return NextResponse.json(
      { success: false, message: 'Token não fornecido.' },
      { status: 401 }
    );
  }

  try {
    const response = await fetch(`${BACKEND_URL}/${params.commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(commentData),
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json({ success: true, comment: data.comment });
    } else {
      return NextResponse.json(
        { success: false, message: data.message || 'Erro ao atualizar comentário.' },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Erro ao atualizar comentário:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno no servidor.' },
      { status: 500 }
    );
  }
}
