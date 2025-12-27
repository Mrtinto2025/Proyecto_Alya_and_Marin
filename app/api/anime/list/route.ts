import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import AnimeList from '@/models/AnimeList';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET - Obtener lista de anime del usuario
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

    const animeList = await AnimeList.find(query).sort({ updatedAt: -1 });

    return NextResponse.json({ animeList }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener lista de anime:', error);
    return NextResponse.json(
      { error: 'Error al obtener lista de anime' },
      { status: 500 }
    );
  }
}

// POST - Agregar anime a la lista
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
    const { animeId, status, rating, episodesWatched, notes } = body;

    if (!animeId || !status) {
      return NextResponse.json(
        { error: 'animeId y status son requeridos' },
        { status: 400 }
      );
    }

    await connectDB();

    // Verificar si ya existe
    const existingEntry = await AnimeList.findOne({
      userId: session.user.id,
      animeId,
    });

    if (existingEntry) {
      return NextResponse.json(
        { error: 'Este anime ya está en tu lista' },
        { status: 400 }
      );
    }

    const newEntry = await AnimeList.create({
      userId: session.user.id,
      animeId,
      status,
      rating: rating || undefined,
      episodesWatched: episodesWatched || 0,
      notes: notes || '',
    });

    return NextResponse.json(
      { message: 'Anime agregado exitosamente', entry: newEntry },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al agregar anime:', error);
    return NextResponse.json(
      { error: 'Error al agregar anime' },
      { status: 500 }
    );
  }
}
