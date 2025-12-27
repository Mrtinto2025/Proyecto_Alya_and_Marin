import { NextResponse } from 'next/server';
import { getMangaDetails } from '@/lib/external/anilist';

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

    const data = await getMangaDetails(id);

    return NextResponse.json({ result: data.Media }, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      },
    });
  } catch (error: any) {
    console.error('Error en detalle manga:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener detalle' },
      { status: 500 }
    );
  }
}
