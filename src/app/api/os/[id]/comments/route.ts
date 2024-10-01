// app/api/os/[id]/comments/route.ts

import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://backendsistema.azurewebsites.net/api/os';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  console.log(`GET /api/os/${params.id}/comments called`); // Debug log

  if (!token) {
    console.error('Token not provided');
    return NextResponse.json(
      { success: false, message: 'Token não fornecido.' },
      { status: 401 }
    );
  }

  try {
    console.log(`Fetching comments for OS ID: ${params.id}`); // Debug log

    const response = await fetch(`${BACKEND_URL}/${params.id}/comments`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(`Backend response status: ${response.status}`);

    if (response.ok) {
      const data = await response.json();
      console.log('Comments fetched successfully for OS'); // Debug log
      return NextResponse.json({ success: true, comments: data });
    } else {
      const errorData = await response.json();
      console.error('Error fetching comments for OS:', errorData); // Error log
      return NextResponse.json(
        { success: false, message: errorData.message || 'Erro ao obter comentários.' },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Error fetching comments for OS:', error); // Error log
    return NextResponse.json(
      { success: false, message: 'Erro interno no servidor.' },
      { status: 500 }
    );
  }
}

// export async function POST(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const token = request.headers.get('Authorization')?.replace('Bearer ', '');
//   const commentData = await request.json();

//   console.log(`POST /api/os/${params.id}/comments called`); // Debug log
//   console.log('Comment data:', commentData);

//   if (!token) {
//     console.error('Token not provided');
//     return NextResponse.json(
//       { success: false, message: 'Token não fornecido.' },
//       { status: 401 }
//     );
//   }

//   try {
//     console.log(`Adding comment to OS ID: ${params.id}`); // Debug log

//     const response = await fetch(`${BACKEND_URL}/${params.id}/comments`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(commentData),
//     });

//     console.log(`Backend response status: ${response.status}`);

//     if (response.ok) {
//       const data = await response.json();
//       console.log('Comment added successfully'); // Debug log
//       return NextResponse.json({
//         success: true,
//         message: data.message,
//         comment: data.comment,
//       });
//     } else {
//       const errorData = await response.json();
//       console.error('Error adding comment:', errorData); // Error log
//       return NextResponse.json(
//         {
//           success: false,
//           message: errorData.message || 'Erro ao adicionar comentário.',
//         },
//         { status: response.status }
//       );
//     }
//   } catch (error) {
//     console.error('Error adding comment:', error); // Error log
//     return NextResponse.json(
//       { success: false, message: 'Erro interno no servidor.' },
//       { status: 500 }
//     );
//   }
// }

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json(
      { success: false, message: 'Token não fornecido.' },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();

    const response = await fetch(`${BACKEND_URL}/${params.id}/comments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData, // Passa o FormData diretamente
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({
        success: true,
        message: data.message,
        comment: data.comment,
      });
    } else {
      const errorData = await response.json();
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || 'Erro ao adicionar comentário.',
        },
        { status: response.status }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Erro interno no servidor.' },
      { status: 500 }
    );
  }
}