import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import AnimeList from '@/models/AnimeList';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET - Obtener un anime específico de la lista
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    await connectDB();

    const entry = await AnimeList.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!entry) {
      return NextResponse.json(
        { error: 'Entrada no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ entry }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener anime:', error);
    return NextResponse.json(
      { error: 'Error al obtener anime' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar un anime en la lista
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { status, rating, episodesWatched, notes } = body;

    await connectDB();

    const entry = await AnimeList.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!entry) {
      return NextResponse.json(
        { error: 'Entrada no encontrada' },
        { status: 404 }
      );
    }

    // Actualizar campos
    if (status) entry.status = status;
    if (rating !== undefined) entry.rating = rating;
    if (episodesWatched !== undefined) entry.episodesWatched = episodesWatched;
    if (notes !== undefined) entry.notes = notes;

    await entry.save();

    return NextResponse.json(
      { message: 'Anime actualizado exitosamente', entry },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al actualizar anime:', error);
    return NextResponse.json(
      { error: 'Error al actualizar anime' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un anime de la lista
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    await connectDB();

    const entry = await AnimeList.findOneAndDelete({
      _id: params.id,
      userId: session.user.id,
    });

    if (!entry) {
      return NextResponse.json(
        { error: 'Entrada no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Anime eliminado exitosamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al eliminar anime:', error);
    return NextResponse.json(
      { error: 'Error al eliminar anime' },
      { status: 500 }
    );
  }
}
