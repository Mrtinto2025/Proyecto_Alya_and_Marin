import { NextResponse } from 'next/server';
import { searchManga } from '@/lib/external/anilist';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || undefined;
    const page = Number(searchParams.get('page') || '1');
    const perPage = Number(searchParams.get('perPage') || '10');
    const genre = searchParams.get('genre') || undefined;
    const statusParam = searchParams.get('status') || undefined;
    const year = searchParams.get('year');
    const sortParam = searchParams.get('sort') || undefined;

    const statusMap: Record<string, any> = {
      ongoing: 'RELEASING',
      completed: 'FINISHED',
      hiatus: 'HIATUS',
    };
    const sortMap: Record<string, any> = {
      popularity: 'POPULARITY_DESC',
      score: 'SCORE_DESC',
      year: 'START_DATE_DESC',
    };

    const data = await searchManga({
      query,
      page,
      perPage,
      genre,
      status: statusParam ? statusMap[statusParam] : undefined,
      seasonYear: year ? Number(year) : undefined,
      sort: sortParam ? sortMap[sortParam] : undefined,
    });

    return NextResponse.json(
      {
        pageInfo: data.Page.pageInfo,
        results: data.Page.media,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error: any) {
    console.error('Error en search manga:', error);
    return NextResponse.json(
      { error: error.message || 'Error al buscar manga' },
      { status: 500 }
    );
  }
}
