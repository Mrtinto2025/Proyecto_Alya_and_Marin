import { NextResponse } from 'next/server';
import { getAnimeDetails } from '@/lib/external/anilist';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (Number.isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    const data = await getAnimeDetails(id);

    return NextResponse.json({ result: data.Media }, { status: 200 });
  } catch (error: any) {
    console.error('Error en detalle anime:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener detalle' },
      { status: 500 }
    );
  }
}
