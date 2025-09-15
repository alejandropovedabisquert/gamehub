export interface Genre {
    count: number;
    next: string | null;
    previous: string | null;
    results: GenreResult[];
}

interface GenreResult {
    id: number;
    name: string;
    slug: string;
    games_count: number;
    image_background: string;
}

