// app/api/os/[id]/route.ts (para manipulação de uma OS específica)
import { NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:5000/api/os';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ success: false, message: 'Token não fornecido.' }, { status: 401 });
  }

  try {
    const response = await fetch(`${BACKEND_URL}/${params.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json({ success: true, order: data });
    } else {
      return NextResponse.json({ success: false, message: data.message || 'Erro ao buscar Ordem de Serviço.' }, { status: response.status });
    }
  } catch (error) {
    console.error('Erro no GET de Ordem de Serviço:', error);
    return NextResponse.json({ success: false, message: 'Erro interno no servidor.' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  const orderData = await request.json();

  if (!token) {
    return NextResponse.json({ success: false, message: 'Token não fornecido.' }, { status: 401 });
  }

  try {
    const response = await fetch(`${BACKEND_URL}/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json({ success: true, message: 'Ordem de Serviço atualizada com sucesso!', order: data });
    } else {
      return NextResponse.json({ success: false, message: data.message || 'Erro ao atualizar Ordem de Serviço.' }, { status: response.status });
    }
  } catch (error) {
    console.error('Erro no PUT de Ordem de Serviço:', error);
    return NextResponse.json({ success: false, message: 'Erro interno no servidor.' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ success: false, message: 'Token não fornecido.' }, { status: 401 });
  }

  try {
    const response = await fetch(`${BACKEND_URL}/${params.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return NextResponse.json({ success: true, message: 'Ordem de Serviço deletada com sucesso!' });
    } else {
      const errorText = await response.text();
      return NextResponse.json({ success: false, message: errorText || 'Erro ao deletar Ordem de Serviço.' }, { status: response.status });
    }
  } catch (error) {
    console.error('Erro no DELETE de Ordem de Serviço:', error);
    return NextResponse.json({ success: false, message: 'Erro interno no servidor.' }, { status: 500 });
  }
}
