import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET - Obtener perfil del usuario autenticado
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

    const user = await User.findById(session.user.id).select('-password');

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    return NextResponse.json(
      { error: 'Error al obtener perfil' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar perfil del usuario
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { username, bio, image } = body;

    await connectDB();

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si el nuevo username ya existe (si se está cambiando)
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return NextResponse.json(
          { error: 'El nombre de usuario ya está en uso' },
          { status: 400 }
        );
      }
      user.username = username;
    }

    if (bio !== undefined) user.bio = bio;
    if (image !== undefined) user.image = image;

    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;

    return NextResponse.json(
      { message: 'Perfil actualizado exitosamente', user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    return NextResponse.json(
      { error: 'Error al actualizar perfil' },
      { status: 500 }
    );
  }
}
