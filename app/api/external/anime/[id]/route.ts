import { NextResponse } from 'next/server';
import { getAnimeDetails } from '@/lib/external/anilist';
// import { translateToSpanish } from '@/lib/translate';

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
    
    // TODO: Traducir descripción al español (temporalmente deshabilitado)
    // if (data.Media.description) {
    //   try {
    //     data.Media.description = await translateToSpanish(data.Media.description);
    //   } catch (error) {
    //     console.error('Error traduciendo descripción:', error);
    //   }
    // }

    return NextResponse.json({ result: data.Media }, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      },
    });
  } catch (error: any) {
    console.error('Error en detalle anime:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener detalle' },
      { status: 500 }
    );
  }
}
