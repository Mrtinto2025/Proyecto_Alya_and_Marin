import { NextResponse } from 'next/server';
import { searchAnime } from '@/lib/external/anilist';
// import { translateToSpanish } from '@/lib/translate';

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
      airing: 'RELEASING',
      completed: 'FINISHED',
      upcoming: 'NOT_YET_RELEASED',
    };
    const sortMap: Record<string, any> = {
      popularity: 'POPULARITY_DESC',
      score: 'SCORE_DESC',
      year: 'START_DATE_DESC',
    };

    const data = await searchAnime({
      query,
      page,
      perPage,
      genre,
      status: statusParam ? statusMap[statusParam] : undefined,
      seasonYear: year ? Number(year) : undefined,
      sort: sortParam ? sortMap[sortParam] : undefined,
    });

    // TODO: Traducir descripciones al español (temporalmente deshabilitado)
    // const mediaWithTranslations = await Promise.all(
    //   data.Page.media.map(async (anime: any) => {
    //     if (anime.description) {
    //       try {
    //         anime.description = await translateToSpanish(anime.description);
    //       } catch (error) {
    //         console.error('Error traduciendo anime:', anime.id, error);
    //       }
    //     }
    //     return anime;
    //   })
    // );

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
    console.error('Error en search anime:', error);
    return NextResponse.json(
      { error: error.message || 'Error al buscar anime' },
      { status: 500 }
    );
  }
}
