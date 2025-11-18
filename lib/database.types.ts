export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      cities: {
        Row: {
          id: string
          slug: string
          name_ko: string
          name_en: string
          region: string
          image_url: string
          rank: number
          badge: string | null
          overall_score: number
          cost_per_month: number
          internet_speed: number
          like_percentage: number
          safety_score: number
          budget: string
          korean_region: string
          environment: string[]
          best_season: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name_ko: string
          name_en: string
          region: string
          image_url: string
          rank: number
          badge?: string | null
          overall_score: number
          cost_per_month: number
          internet_speed: number
          like_percentage: number
          safety_score: number
          budget: string
          korean_region: string
          environment: string[]
          best_season: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name_ko?: string
          name_en?: string
          region?: string
          image_url?: string
          rank?: number
          badge?: string | null
          overall_score?: number
          cost_per_month?: number
          internet_speed?: number
          like_percentage?: number
          safety_score?: number
          budget?: string
          korean_region?: string
          environment?: string[]
          best_season?: string
          created_at?: string
          updated_at?: string
        }
      }
      city_details: {
        Row: {
          id: string
          city_id: string
          description: string
          highlights: string[]
          gallery_images: string[]
          pros: string[]
          cons: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          city_id: string
          description: string
          highlights: string[]
          gallery_images: string[]
          pros: string[]
          cons: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          city_id?: string
          description?: string
          highlights?: string[]
          gallery_images?: string[]
          pros?: string[]
          cons?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      cost_breakdown: {
        Row: {
          id: string
          city_id: string
          accommodation: number
          food: number
          transportation: number
          utilities: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          city_id: string
          accommodation: number
          food: number
          transportation: number
          utilities: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          city_id?: string
          accommodation?: number
          food?: number
          transportation?: number
          utilities?: number
          created_at?: string
          updated_at?: string
        }
      }
      city_stats: {
        Row: {
          id: string
          city_id: string
          reviews_count: number
          nomads_now: number
          likes: number
          dislikes: number
          temperature: number | null
          aqi: number | null
          weather_condition: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          city_id: string
          reviews_count?: number
          nomads_now?: number
          likes?: number
          dislikes?: number
          temperature?: number | null
          aqi?: number | null
          weather_condition?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          city_id?: string
          reviews_count?: number
          nomads_now?: number
          likes?: number
          dislikes?: number
          temperature?: number | null
          aqi?: number | null
          weather_condition?: string | null
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          city_id: string
          user_id: string
          rating: number
          title: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          city_id: string
          user_id: string
          rating: number
          title: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          city_id?: string
          user_id?: string
          rating?: number
          title?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_likes: {
        Row: {
          id: string
          user_id: string
          city_id: string
          is_like: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          city_id: string
          is_like: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          city_id?: string
          is_like?: boolean
          created_at?: string
        }
      }
      user_bookmarks: {
        Row: {
          id: string
          user_id: string
          city_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          city_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          city_id?: string
          created_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          username: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage
export type City = Database['public']['Tables']['cities']['Row']
export type CityInsert = Database['public']['Tables']['cities']['Insert']
export type CityUpdate = Database['public']['Tables']['cities']['Update']

export type CityDetails = Database['public']['Tables']['city_details']['Row']
export type CityDetailsInsert = Database['public']['Tables']['city_details']['Insert']
export type CityDetailsUpdate = Database['public']['Tables']['city_details']['Update']

export type CostBreakdown = Database['public']['Tables']['cost_breakdown']['Row']
export type CostBreakdownInsert = Database['public']['Tables']['cost_breakdown']['Insert']
export type CostBreakdownUpdate = Database['public']['Tables']['cost_breakdown']['Update']

export type CityStats = Database['public']['Tables']['city_stats']['Row']
export type CityStatsInsert = Database['public']['Tables']['city_stats']['Insert']
export type CityStatsUpdate = Database['public']['Tables']['city_stats']['Update']

export type Review = Database['public']['Tables']['reviews']['Row']
export type ReviewInsert = Database['public']['Tables']['reviews']['Insert']
export type ReviewUpdate = Database['public']['Tables']['reviews']['Update']

export type UserLike = Database['public']['Tables']['user_likes']['Row']
export type UserLikeInsert = Database['public']['Tables']['user_likes']['Insert']
export type UserLikeUpdate = Database['public']['Tables']['user_likes']['Update']

export type UserBookmark = Database['public']['Tables']['user_bookmarks']['Row']
export type UserBookmarkInsert = Database['public']['Tables']['user_bookmarks']['Insert']
export type UserBookmarkUpdate = Database['public']['Tables']['user_bookmarks']['Update']

export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
export type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert']
export type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update']

// Combined type for City with all related data
export interface CityWithDetails extends City {
  city_details?: CityDetails | null
  cost_breakdown?: CostBreakdown | null
  city_stats?: CityStats | null
}

// Type for City list item (used in main page)
export interface CityListItem extends City {
  city_stats?: CityStats | null
}