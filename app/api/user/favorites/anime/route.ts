import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// POST - Agregar anime a favoritos
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
    const { animeId } = body;

    if (!animeId) {
      return NextResponse.json(
        { error: 'animeId es requerido' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si ya está en favoritos
    if (user.favoriteAnime.includes(animeId)) {
      return NextResponse.json(
        { error: 'Este anime ya está en favoritos' },
        { status: 400 }
      );
    }

    user.favoriteAnime.push(animeId);
    await user.save();

    return NextResponse.json(
      { message: 'Anime agregado a favoritos', favoriteAnime: user.favoriteAnime },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al agregar anime a favoritos:', error);
    return NextResponse.json(
      { error: 'Error al agregar anime a favoritos' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar anime de favoritos
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const animeId = searchParams.get('animeId');

    if (!animeId) {
      return NextResponse.json(
        { error: 'animeId es requerido' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    user.favoriteAnime = user.favoriteAnime.filter((id: string) => id !== animeId);
    await user.save();

    return NextResponse.json(
      { message: 'Anime eliminado de favoritos', favoriteAnime: user.favoriteAnime },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al eliminar anime de favoritos:', error);
    return NextResponse.json(
      { error: 'Error al eliminar anime de favoritos' },
      { status: 500 }
    );
  }
}
