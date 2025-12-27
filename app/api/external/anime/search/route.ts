import { NextResponse } from 'next/server';
import { searchAnime } from '@/lib/external/anilist';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const page = Number(searchParams.get('page') || '1');
    const perPage = Number(searchParams.get('perPage') || '10');

    const data = await searchAnime({ query, page, perPage });

    return NextResponse.json(
      {
        pageInfo: data.Page.pageInfo,
        results: data.Page.media,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error en search anime:', error);
    return NextResponse.json(
      { error: error.message || 'Error al buscar anime' },
      { status: 500 }
    );
  }
}
