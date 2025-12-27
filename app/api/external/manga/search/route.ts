import { NextResponse } from 'next/server';
import { searchManga } from '@/lib/external/anilist';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const page = Number(searchParams.get('page') || '1');
    const perPage = Number(searchParams.get('perPage') || '10');

    const data = await searchManga({ query, page, perPage });

    return NextResponse.json(
      {
        pageInfo: data.Page.pageInfo,
        results: data.Page.media,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error en search manga:', error);
    return NextResponse.json(
      { error: error.message || 'Error al buscar manga' },
      { status: 500 }
    );
  }
}
