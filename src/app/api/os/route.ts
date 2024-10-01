// app/api/os/route.ts (para manipulação de várias OS)
import { NextResponse } from 'next/server';

const BACKEND_URL = 'https://backendsistema.azurewebsites.net/api/os';

export async function GET(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ success: false, message: 'Token não fornecido.' }, { status: 401 });
  }

  try {
    const response = await fetch(BACKEND_URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      mode: 'no-cors',
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json({ success: true, orders: data });
    } else {
      return NextResponse.json({ success: false, message: data.message || 'Erro ao listar Ordens de Serviço.' }, { status: response.status });
    }
  } catch (error) {
    console.error('Erro no GET de Ordens de Serviço:', error);
    return NextResponse.json({ success: false, message: 'Erro interno no servidor.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  const orderData = await request.json();

  if (!token) {
    return NextResponse.json({ success: false, message: 'Token não fornecido.' }, { status: 401 });
  }

  // Verificar se todos os campos obrigatórios estão presentes
  const { title, description,local, assignedUser, startTime, endTime, isRecurring } = orderData;

  if (!title || !description  || !assignedUser || !startTime || !endTime) {
    return NextResponse.json({ success: false, message: 'Campos obrigatórios não fornecidos.' }, { status: 400 });
  }

  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        mode: 'no-cors',
      },
      body: JSON.stringify({
        title,
        description,
        local,
        assignedUser,
        startTime,
        endTime,
        isRecurring,
      }),
    });

    const responseText = await response.text();
    console.log('Resposta bruta do backend:', responseText);

    if (response.headers.get('Content-Type')?.includes('application/json')) {
      const data = JSON.parse(responseText);

      if (response.ok) {
        return NextResponse.json({ success: true, message: 'Ordem de Serviço criada com sucesso!', order: data });
      } else {
        console.error('Erro ao criar Ordem de Serviço:', data);
        return NextResponse.json({ success: false, message: data.message || 'Erro ao criar Ordem de Serviço.' }, { status: response.status });
      }
    } else {
      console.error('Resposta inesperada do backend:', responseText);
      return NextResponse.json({ success: false, message: 'Erro inesperado no servidor.', rawResponse: responseText }, { status: 500 });
    }
  } catch (error) {
    console.error('Erro no processamento da requisição POST:', error);
    return NextResponse.json({ success: false, message: 'Erro interno no servidor ao criar Ordem de Serviço.' }, { status: 500 });
  }
}
