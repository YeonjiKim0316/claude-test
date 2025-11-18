"use server";

import { createClient } from "@/utils/supabase/server";
import { CityWithDetails, CityListItem } from "@/lib/database.types";

export interface FilterState {
  budget?: string;
  regions?: string[];
  environments?: string[];
  season?: string;
  searchQuery?: string;
}

/**
 * Get all cities with optional filtering
 */
export async function getCities(filters?: FilterState) {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("cities")
      .select(`
        *,
        city_stats (
          reviews_count,
          nomads_now,
          likes,
          dislikes,
          temperature,
          aqi,
          weather_condition
        )
      `)
      .order("rank", { ascending: true });

    // Apply filters
    if (filters?.budget) {
      query = query.eq("budget", filters.budget);
    }

    if (filters?.regions && filters.regions.length > 0 && !filters.regions.includes("전체")) {
      query = query.in("korean_region", filters.regions);
    }

    if (filters?.environments && filters.environments.length > 0) {
      // For array contains, we need to use overlaps
      query = query.overlaps("environment", filters.environments);
    }

    if (filters?.season) {
      query = query.eq("best_season", filters.season);
    }

    if (filters?.searchQuery) {
      query = query.or(
        `name_ko.ilike.%${filters.searchQuery}%,name_en.ilike.%${filters.searchQuery}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching cities:", error);
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: data as CityListItem[], error: null };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: "도시 목록을 불러오는 중 오류가 발생했습니다.",
      data: [],
    };
  }
}

/**
 * Get a single city by slug with all details
 */
export async function getCityBySlug(slug: string) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("cities")
      .select(`
        *,
        city_details (*),
        cost_breakdown (*),
        city_stats (*)
      `)
      .eq("slug", slug)
      .single();

    if (error) {
      console.error("Error fetching city:", error);
      return { success: false, error: error.message, data: null };
    }

    if (!data) {
      return { success: false, error: "도시를 찾을 수 없습니다.", data: null };
    }

    return { success: true, data: data as CityWithDetails, error: null };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: "도시 정보를 불러오는 중 오류가 발생했습니다.",
      data: null,
    };
  }
}

/**
 * Get city stats for realtime updates
 */
export async function getCityStats(cityId: string) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("city_stats")
      .select("*")
      .eq("city_id", cityId)
      .single();

    if (error) {
      console.error("Error fetching city stats:", error);
      return { success: false, error: error.message, data: null };
    }

    return { success: true, data, error: null };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: "통계 정보를 불러오는 중 오류가 발생했습니다.",
      data: null,
    };
  }
}

/**
 * Search cities by name
 */
export async function searchCities(query: string) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("cities")
      .select(`
        *,
        city_stats (
          reviews_count,
          nomads_now,
          likes,
          dislikes
        )
      `)
      .or(`name_ko.ilike.%${query}%,name_en.ilike.%${query}%`)
      .order("rank", { ascending: true })
      .limit(10);

    if (error) {
      console.error("Error searching cities:", error);
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: data as CityListItem[], error: null };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: "검색 중 오류가 발생했습니다.",
      data: [],
    };
  }
}

/**
 * Get total statistics (for hero section)
 */
export async function getTotalStats() {
  try {
    const supabase = await createClient();

    // Get total cities count
    const { count: citiesCount, error: citiesError } = await supabase
      .from("cities")
      .select("*", { count: "exact", head: true });

    if (citiesError) {
      throw citiesError;
    }

    // Get sum of reviews and nomads
    const { data: statsData, error: statsError } = await supabase
      .from("city_stats")
      .select("reviews_count, nomads_now");

    if (statsError) {
      throw statsError;
    }

    const totalReviews = statsData?.reduce((sum, stat) => sum + stat.reviews_count, 0) || 0;
    const totalNomads = statsData?.reduce((sum, stat) => sum + stat.nomads_now, 0) || 0;

    return {
      success: true,
      data: {
        cities: citiesCount || 0,
        reviews: totalReviews,
        nomads: totalNomads,
      },
      error: null,
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: "통계를 불러오는 중 오류가 발생했습니다.",
      data: { cities: 0, reviews: 0, nomads: 0 },
    };
  }
}