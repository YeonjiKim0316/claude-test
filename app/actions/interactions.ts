"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Toggle like/dislike for a city
 */
export async function toggleLike(cityId: string, isLike: boolean) {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "로그인이 필요합니다." };
    }

    // Check if user already liked/disliked this city
    const { data: existing } = await supabase
      .from("user_likes")
      .select("*")
      .eq("user_id", user.id)
      .eq("city_id", cityId)
      .single();

    if (existing) {
      // If same preference, remove it (toggle off)
      if (existing.is_like === isLike) {
        const { error: deleteError } = await supabase
          .from("user_likes")
          .delete()
          .eq("id", existing.id);

        if (deleteError) {
          console.error("Error removing like:", deleteError);
          return { success: false, error: deleteError.message };
        }

        revalidatePath(`/cities/[id]`, "page");
        return { success: true, action: "removed", error: null };
      } else {
        // If different preference, update it
        const { error: updateError } = await supabase
          .from("user_likes")
          .update({ is_like: isLike })
          .eq("id", existing.id);

        if (updateError) {
          console.error("Error updating like:", updateError);
          return { success: false, error: updateError.message };
        }

        revalidatePath(`/cities/[id]`, "page");
        return { success: true, action: "updated", error: null };
      }
    } else {
      // Create new like/dislike
      const { error: insertError } = await supabase
        .from("user_likes")
        .insert({
          user_id: user.id,
          city_id: cityId,
          is_like: isLike,
        });

      if (insertError) {
        console.error("Error creating like:", insertError);
        return { success: false, error: insertError.message };
      }

      revalidatePath(`/cities/[id]`, "page");
      return { success: true, action: "created", error: null };
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: "작업 중 오류가 발생했습니다.",
    };
  }
}

/**
 * Get user's like status for a city
 */
export async function getUserLikeStatus(cityId: string) {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: true, data: null, error: null };
    }

    const { data, error } = await supabase
      .from("user_likes")
      .select("is_like")
      .eq("user_id", user.id)
      .eq("city_id", cityId)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows returned
      console.error("Error fetching like status:", error);
      return { success: false, error: error.message, data: null };
    }

    return { success: true, data: data?.is_like ?? null, error: null };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: "좋아요 상태를 확인하는 중 오류가 발생했습니다.",
      data: null,
    };
  }
}

/**
 * Toggle bookmark for a city
 */
export async function toggleBookmark(cityId: string) {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "로그인이 필요합니다." };
    }

    // Check if bookmark exists
    const { data: existing } = await supabase
      .from("user_bookmarks")
      .select("*")
      .eq("user_id", user.id)
      .eq("city_id", cityId)
      .single();

    if (existing) {
      // Remove bookmark
      const { error: deleteError } = await supabase
        .from("user_bookmarks")
        .delete()
        .eq("id", existing.id);

      if (deleteError) {
        console.error("Error removing bookmark:", deleteError);
        return { success: false, error: deleteError.message };
      }

      revalidatePath(`/cities/[id]`, "page");
      return { success: true, action: "removed", error: null };
    } else {
      // Add bookmark
      const { error: insertError } = await supabase
        .from("user_bookmarks")
        .insert({
          user_id: user.id,
          city_id: cityId,
        });

      if (insertError) {
        console.error("Error creating bookmark:", insertError);
        return { success: false, error: insertError.message };
      }

      revalidatePath(`/cities/[id]`, "page");
      return { success: true, action: "created", error: null };
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: "북마크 처리 중 오류가 발생했습니다.",
    };
  }
}

/**
 * Check if user has bookmarked a city
 */
export async function getBookmarkStatus(cityId: string) {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: true, data: false, error: null };
    }

    const { data, error } = await supabase
      .from("user_bookmarks")
      .select("id")
      .eq("user_id", user.id)
      .eq("city_id", cityId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching bookmark status:", error);
      return { success: false, error: error.message, data: false };
    }

    return { success: true, data: !!data, error: null };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: "북마크 상태를 확인하는 중 오류가 발생했습니다.",
      data: false,
    };
  }
}

/**
 * Get user's bookmarked cities
 */
export async function getUserBookmarks() {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "로그인이 필요합니다.", data: [] };
    }

    const { data, error } = await supabase
      .from("user_bookmarks")
      .select(`
        *,
        cities (
          *,
          city_stats (
            reviews_count,
            nomads_now,
            likes,
            dislikes
          )
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching bookmarks:", error);
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: data || [], error: null };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: "북마크를 불러오는 중 오류가 발생했습니다.",
      data: [],
    };
  }
}

/**
 * Get user's liked cities
 */
export async function getUserLikes() {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "로그인이 필요합니다.", data: [] };
    }

    const { data, error } = await supabase
      .from("user_likes")
      .select(`
        *,
        cities (
          *,
          city_stats (
            reviews_count,
            nomads_now,
            likes,
            dislikes
          )
        )
      `)
      .eq("user_id", user.id)
      .eq("is_like", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching likes:", error);
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: data || [], error: null };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: "좋아요 목록을 불러오는 중 오류가 발생했습니다.",
      data: [],
    };
  }
}
