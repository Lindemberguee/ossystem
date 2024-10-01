import { NextResponse } from 'next/server';

const BACKEND_URL = 'https://backendsistema.azurewebsites.net/api/os';

// Rota para buscar ordens de serviço por ID do usuário
export async function GET(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  const userId = new URL(request.url).searchParams.get('userId');

  if (!token) {
    return NextResponse.json({ success: false, message: 'Token não fornecido.' }, { status: 401 });
  }

  if (!userId) {
    return NextResponse.json({ success: false, message: 'ID do usuário não fornecido.' }, { status: 400 });
  }

  try {
    const response = await fetch(BACKEND_URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro ao buscar ordens:', errorData);
      return NextResponse.json({ success: false, message: errorData.message || 'Erro ao buscar Ordens de Serviço.' }, { status: response.status });
    }

    const orders = await response.json();
    const userOrders = orders.filter((order: { assignedUser: { _id: string; }; }) => order.assignedUser._id === userId);

    return NextResponse.json({ success: true, orders: userOrders });
  } catch (error) {
    console.error('Erro interno ao buscar ordens:', error);
    return NextResponse.json({ success: false, message: 'Erro interno ao buscar ordens.' }, { status: 500 });
  }
}

// Rota para criar uma nova ordem de serviço
export async function POST(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  const orderData = await request.json();

  if (!token) {
    return NextResponse.json({ success: false, message: 'Token não fornecido.' }, { status: 401 });
  }

  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json({ success: true, message: 'Ordem de Serviço criada com sucesso!', order: data });
    } else {
      return NextResponse.json({ success: false, message: data.message || 'Erro ao criar Ordem de Serviço.' }, { status: response.status });
    }
  } catch (error) {
    console.error('Erro ao criar ordem:', error);
    return NextResponse.json({ success: false, message: 'Erro interno ao criar ordem.' }, { status: 500 });
  }
}

// Rota para atualizar uma ordem de serviço existente
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
    console.error('Erro ao atualizar ordem:', error);
    return NextResponse.json({ success: false, message: 'Erro interno ao atualizar ordem.' }, { status: 500 });
  }
}

// Rota para excluir uma ordem de serviço existente
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
      return NextResponse.json({ success: true, message: 'Ordem de Serviço excluída com sucesso!' });
    } else {
      const errorData = await response.json();
      return NextResponse.json({ success: false, message: errorData.message || 'Erro ao excluir Ordem de Serviço.' }, { status: response.status });
    }
  } catch (error) {
    console.error('Erro ao excluir ordem:', error);
    return NextResponse.json({ success: false, message: 'Erro interno ao excluir ordem.' }, { status: 500 });
  }
}
