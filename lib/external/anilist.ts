const ANILIST_ENDPOINT = 'https://graphql.anilist.co';

interface AniListVariables {
  [key: string]: any;
}

interface AniListResponse<T> {
  data?: T;
  errors?: { message: string }[];
}

async function fetchAniList<T>(query: string, variables: AniListVariables): Promise<T> {
  const res = await fetch(ANILIST_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
    // Nota: AniList no requiere API key
    // Cache control: dejamos que las rutas proxy decidan (no-store por defecto)
  });

  const json = (await res.json()) as AniListResponse<T>;

  if (!res.ok || json.errors) {
    const message = json.errors?.[0]?.message || 'Error consultando AniList';
    throw new Error(message);
  }

  if (!json.data) {
    throw new Error('Respuesta vacía de AniList');
  }

  return json.data;
}

// ================= Anime =================

export async function searchAnime(params: {
  query: string;
  page?: number;
  perPage?: number;
}) {
  const query = `
    query ($query: String, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
        }
        media(search: $query, type: ANIME, sort: POPULARITY_DESC) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            large
            color
          }
          format
          status
          episodes
          averageScore
          genres
          description(asHtml: false)
          seasonYear
        }
      }
    }
  `;

  return fetchAniList<{
    Page: {
      pageInfo: any;
      media: any[];
    };
  }>(query, {
    query: params.query,
    page: params.page || 1,
    perPage: params.perPage || 10,
  });
}

export async function getAnimeDetails(id: number) {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          extraLarge
          large
          color
        }
        bannerImage
        description(asHtml: false)
        episodes
        duration
        format
        status
        season
        seasonYear
        averageScore
        popularity
        genres
        studios(isMain: true) {
          nodes {
            name
          }
        }
        characters(page: 1, perPage: 6) {
          edges {
            role
            node {
              id
              name { full }
              image { large }
            }
          }
        }
      }
    }
  `;

  return fetchAniList<{ Media: any }>(query, { id });
}

// ================= Manga =================

export async function searchManga(params: {
  query: string;
  page?: number;
  perPage?: number;
}) {
  const query = `
    query ($query: String, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
        }
        media(search: $query, type: MANGA, sort: POPULARITY_DESC) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            large
            color
          }
          format
          status
          chapters
          volumes
          averageScore
          genres
          description(asHtml: false)
          seasonYear
        }
      }
    }
  `;

  return fetchAniList<{
    Page: {
      pageInfo: any;
      media: any[];
    };
  }>(query, {
    query: params.query,
    page: params.page || 1,
    perPage: params.perPage || 10,
  });
}

export async function getMangaDetails(id: number) {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: MANGA) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          extraLarge
          large
          color
        }
        bannerImage
        description(asHtml: false)
        chapters
        volumes
        format
        status
        averageScore
        popularity
        genres
        staff(page: 1, perPage: 6) {
          nodes {
            id
            name { full }
            primaryOccupations
          }
        }
      }
    }
  `;

  return fetchAniList<{ Media: any }>(query, { id });
}
