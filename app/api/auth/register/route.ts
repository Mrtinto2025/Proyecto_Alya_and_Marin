import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { registerSchema } from '@/lib/validations';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validar datos con Zod
    const validatedData = registerSchema.parse(body);

    await connectDB();

    // Verificar si el email ya existe
    const existingEmail = await User.findOne({ email: validatedData.email });
    if (existingEmail) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 400 }
      );
    }

    // Verificar si el username ya existe
    const existingUsername = await User.findOne({ username: validatedData.username });
    if (existingUsername) {
      return NextResponse.json(
        { error: 'El nombre de usuario ya está en uso' },
        { status: 400 }
      );
    }

    // Hashear contraseña con bcrypt (mayor seguridad)
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Crear nuevo usuario
    const newUser = await User.create({
      username: validatedData.username,
      email: validatedData.email,
      password: hashedPassword,
      role: 'user',
    });

    // Retornar usuario sin contraseña
    const userResponse = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    };

    return NextResponse.json(
      { message: 'Usuario registrado exitosamente', user: userResponse },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error en registro:', error);

    // Errores de validación de Zod
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error al registrar usuario' },
      { status: 500 }
    );
  }
}
