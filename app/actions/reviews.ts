"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export interface CreateReviewData {
  cityId: string;
  rating: number;
  title: string;
  content: string;
}

export interface UpdateReviewData {
  rating?: number;
  title?: string;
  content?: string;
}

/**
 * Get reviews for a specific city
 */
export async function getReviewsByCity(cityId: string, limit = 10, offset = 0) {
  try {
    const supabase = await createClient();

    const { data, error, count } = await supabase
      .from("reviews")
      .select(`
        *,
        user_profiles (
          username,
          avatar_url
        )
      `, { count: "exact" })
      .eq("city_id", cityId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching reviews:", error);
      return { success: false, error: error.message, data: [], total: 0 };
    }

    return { success: true, data: data || [], total: count || 0, error: null };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: "리뷰를 불러오는 중 오류가 발생했습니다.",
      data: [],
      total: 0,
    };
  }
}

/**
 * Create a new review (authenticated users only)
 */
export async function createReview(reviewData: CreateReviewData) {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "로그인이 필요합니다.", data: null };
    }

    // Validate rating
    if (reviewData.rating < 1 || reviewData.rating > 5) {
      return { success: false, error: "평점은 1~5 사이여야 합니다.", data: null };
    }

    // Check if user already reviewed this city
    const { data: existingReview } = await supabase
      .from("reviews")
      .select("id")
      .eq("city_id", reviewData.cityId)
      .eq("user_id", user.id)
      .single();

    if (existingReview) {
      return {
        success: false,
        error: "이미 이 도시에 대한 리뷰를 작성하셨습니다.",
        data: null,
      };
    }

    // Create review
    const { data, error } = await supabase
      .from("reviews")
      .insert({
        city_id: reviewData.cityId,
        user_id: user.id,
        rating: reviewData.rating,
        title: reviewData.title,
        content: reviewData.content,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating review:", error);
      return { success: false, error: error.message, data: null };
    }

    // Revalidate the city page
    revalidatePath(`/cities/[id]`, "page");

    return { success: true, data, error: null };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: "리뷰 작성 중 오류가 발생했습니다.",
      data: null,
    };
  }
}

/**
 * Update an existing review (owner only)
 */
export async function updateReview(reviewId: string, updateData: UpdateReviewData) {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "로그인이 필요합니다.", data: null };
    }

    // Validate rating if provided
    if (updateData.rating !== undefined && (updateData.rating < 1 || updateData.rating > 5)) {
      return { success: false, error: "평점은 1~5 사이여야 합니다.", data: null };
    }

    // Update review (RLS will ensure user can only update their own review)
    const { data, error } = await supabase
      .from("reviews")
      .update(updateData)
      .eq("id", reviewId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating review:", error);
      return { success: false, error: error.message, data: null };
    }

    if (!data) {
      return {
        success: false,
        error: "리뷰를 찾을 수 없거나 수정 권한이 없습니다.",
        data: null,
      };
    }

    // Revalidate the city page
    revalidatePath(`/cities/[id]`, "page");

    return { success: true, data, error: null };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: "리뷰 수정 중 오류가 발생했습니다.",
      data: null,
    };
  }
}

/**
 * Delete a review (owner only)
 */
export async function deleteReview(reviewId: string) {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "로그인이 필요합니다." };
    }

    // Delete review (RLS will ensure user can only delete their own review)
    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", reviewId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting review:", error);
      return { success: false, error: error.message };
    }

    // Revalidate the city page
    revalidatePath(`/cities/[id]`, "page");

    return { success: true, error: null };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: "리뷰 삭제 중 오류가 발생했습니다.",
    };
  }
}

/**
 * Get user's own reviews
 */
export async function getUserReviews() {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "로그인이 필요합니다.", data: [] };
    }

    const { data, error } = await supabase
      .from("reviews")
      .select(`
        *,
        cities (
          name_ko,
          slug,
          image_url
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user reviews:", error);
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: data || [], error: null };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: "리뷰를 불러오는 중 오류가 발생했습니다.",
      data: [],
    };
  }
}