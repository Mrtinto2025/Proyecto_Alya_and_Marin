import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import MangaList from '@/models/MangaList';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET - Obtener lista de manga del usuario
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query: any = { userId: session.user.id };
    
    if (status) {
      query.status = status;
    }

    const mangaList = await MangaList.find(query).sort({ updatedAt: -1 });

    return NextResponse.json({ mangaList }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener lista de manga:', error);
    return NextResponse.json(
      { error: 'Error al obtener lista de manga' },
      { status: 500 }
    );
  }
}

// POST - Agregar manga a la lista
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { mangaId, status, rating, chaptersRead, notes } = body;

    if (!mangaId || !status) {
      return NextResponse.json(
        { error: 'mangaId y status son requeridos' },
        { status: 400 }
      );
    }

    await connectDB();

    // Verificar si ya existe
    const existingEntry = await MangaList.findOne({
      userId: session.user.id,
      mangaId,
    });

    if (existingEntry) {
      return NextResponse.json(
        { error: 'Este manga ya está en tu lista' },
        { status: 400 }
      );
    }

    const newEntry = await MangaList.create({
      userId: session.user.id,
      mangaId,
      status,
      rating: rating || undefined,
      chaptersRead: chaptersRead || 0,
      notes: notes || '',
    });

    return NextResponse.json(
      { message: 'Manga agregado exitosamente', entry: newEntry },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al agregar manga:', error);
    return NextResponse.json(
      { error: 'Error al agregar manga' },
      { status: 500 }
    );
  }
}
