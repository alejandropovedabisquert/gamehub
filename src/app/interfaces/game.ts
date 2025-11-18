export interface Game {
  count: number;
  next: string | null;
  previous: string | null;
  results: GameResult[];
}

export interface GameResult {
    id: number;
    slug: string;
    name: string;
    released: string;
    tba: boolean;
    background_image: string;
    rating: number;
    rating_top: number;
    ratings: Record<string, number>;
    ratings_count: number;
    reviews_text_count: string;
    added: number;
    added_by_status: Record<string, unknown>;
    metacritic: number | null;
    playtime: number;
    suggestions_count: number;
    updated: string;
    esrb_rating: {
        id: number;
        slug: string;
        name: string;
    };
    platforms: Platform[];
    parent_platforms: ParentPlatform[];
    genres: {
        id: number;
        slug: string;
        name: string;
    }[];
}
interface ParentPlatform {
    platform: {
        id: number;
        slug: string;
        name: string;
    }
}
interface Platform {
    platform: {
        id: number;
        slug: string;
        name: string;
    },
    released_at: string;
    requirements: {
        minimum: string;
        recommended: string;
    }
}
