export interface Platform {
    count: number;
    next: string | null;
    previous: string | null;
    results: PlatformResult[];
}

interface PlatformResult {
    id: number;
    name: string;
    slug: string;
    games_count: number;
    image_background: string | null;
    image: string | null;
    year_start: number | null;
    year_end: number | null;
}