interface MetacriticPlatform {
  metascore: number;
  url: string;
}

interface ESRBRating {
  id: number;
  slug: string;
  name: string;
}

interface Platform {
  id: number;
  slug: string;
  name: string;
}

interface PlatformRequirement {
  minimum: string;
  recommended: string;
}

interface GamePlatform {
  platform: Platform;
  released_at: string;
  requirements: PlatformRequirement;
}

export interface GameDetailInterface {
  id: number;
  slug: string;
  name: string;
  name_original: string;
  description: string;
  metacritic: number;
  metacritic_platforms: MetacriticPlatform[];
  released: string;
  tba: boolean;
  updated: string;
  background_image: string;
  background_image_additional: string;
  website: string;
  rating: number;
  rating_top: number;
  ratings: Record<string, unknown>;
  reactions: Record<string, unknown>;
  added: number;
  added_by_status: Record<string, unknown>;
  playtime: number;
  screenshots_count: number;
  movies_count: number;
  creators_count: number;
  achievements_count: number;
  parent_achievements_count: string;
  reddit_url: string;
  reddit_name: string;
  reddit_description: string;
  reddit_logo: string;
  reddit_count: number;
  twitch_count: string;
  youtube_count: string;
  reviews_text_count: string;
  ratings_count: number;
  suggestions_count: number;
  alternative_names: string[];
  metacritic_url: string;
  parents_count: number;
  additions_count: number;
  game_series_count: number;
  esrb_rating: ESRBRating;
  platforms: GamePlatform[];
}