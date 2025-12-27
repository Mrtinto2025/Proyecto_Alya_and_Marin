import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import MangaList from '@/models/MangaList';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET - Obtener un manga específico de la lista
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

    const entry = await MangaList.findOne({
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
    console.error('Error al obtener manga:', error);
    return NextResponse.json(
      { error: 'Error al obtener manga' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar un manga en la lista
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
    const { status, rating, chaptersRead, notes } = body;

    await connectDB();

    const entry = await MangaList.findOne({
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
    if (chaptersRead !== undefined) entry.chaptersRead = chaptersRead;
    if (notes !== undefined) entry.notes = notes;

    await entry.save();

    return NextResponse.json(
      { message: 'Manga actualizado exitosamente', entry },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al actualizar manga:', error);
    return NextResponse.json(
      { error: 'Error al actualizar manga' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un manga de la lista
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

    const entry = await MangaList.findOneAndDelete({
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
      { message: 'Manga eliminado exitosamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al eliminar manga:', error);
    return NextResponse.json(
      { error: 'Error al eliminar manga' },
      { status: 500 }
    );
  }
}
