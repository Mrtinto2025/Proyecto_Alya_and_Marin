import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// POST - Agregar manga a favoritos
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
    const { mangaId } = body;

    if (!mangaId) {
      return NextResponse.json(
        { error: 'mangaId es requerido' },
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
    if (user.favoriteManga.includes(mangaId)) {
      return NextResponse.json(
        { error: 'Este manga ya está en favoritos' },
        { status: 400 }
      );
    }

    user.favoriteManga.push(mangaId);
    await user.save();

    return NextResponse.json(
      { message: 'Manga agregado a favoritos', favoriteManga: user.favoriteManga },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al agregar manga a favoritos:', error);
    return NextResponse.json(
      { error: 'Error al agregar manga a favoritos' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar manga de favoritos
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
    const mangaId = searchParams.get('mangaId');

    if (!mangaId) {
      return NextResponse.json(
        { error: 'mangaId es requerido' },
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

    user.favoriteManga = user.favoriteManga.filter((id: string) => id !== mangaId);
    await user.save();

    return NextResponse.json(
      { message: 'Manga eliminado de favoritos', favoriteManga: user.favoriteManga },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al eliminar manga de favoritos:', error);
    return NextResponse.json(
      { error: 'Error al eliminar manga de favoritos' },
      { status: 500 }
    );
  }
}
