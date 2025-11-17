export interface City {
  id: string;
  slug: string;
  name_ko: string;
  name_en: string;
  region: string;
  image_url: string;
  rank: number;
  badge?: "Popular" | "Trending" | null;

  // Metrics
  overall_score: number;
  cost_per_month: number; // KRW
  internet_speed: number; // Mbps
  like_percentage: number;
  safety_score: number;

  // Statistics
  reviews_count: number;
  nomads_now: number;
  likes: number;
  dislikes: number;

  // Realtime data
  temperature?: number;
  aqi?: number;
  weather_condition?: string;

  // Phase 3: Filter properties
  budget: "150만원 이하" | "150~250만원" | "250만원 이상";
  koreanRegion: "수도권" | "경상도" | "전라도" | "강원도" | "제주도" | "충청도";
  environment: ("자연친화" | "도심선호" | "카페작업" | "코워킹 필수")[];
  bestSeason: "봄" | "여름" | "가을" | "겨울";
}
