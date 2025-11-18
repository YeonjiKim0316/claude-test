"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export interface UpdateProfileData {
  username?: string;
  bio?: string;
  avatar_url?: string;
}

/**
 * Get user profile by user ID
 */
export async function getProfile(userId: string) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return { success: false, error: error.message, data: null };
    }

    return { success: true, data, error: null };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: "프로필을 불러오는 중 오류가 발생했습니다.",
      data: null,
    };
  }
}

/**
 * Get current user's profile
 */
export async function getCurrentUserProfile() {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "로그인이 필요합니다.", data: null };
    }

    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return { success: false, error: error.message, data: null };
    }

    return { success: true, data, error: null };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: "프로필을 불러오는 중 오류가 발생했습니다.",
      data: null,
    };
  }
}

/**
 * Update user profile (owner only)
 */
export async function updateProfile(updateData: UpdateProfileData) {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "로그인이 필요합니다.", data: null };
    }

    // Validate username if provided
    if (updateData.username !== undefined) {
      // Check if username is already taken
      const { data: existingUser } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("username", updateData.username)
        .neq("id", user.id)
        .single();

      if (existingUser) {
        return {
          success: false,
          error: "이미 사용 중인 사용자 이름입니다.",
          data: null,
        };
      }

      // Validate username format (alphanumeric, underscore, hyphen only)
      const usernameRegex = /^[a-zA-Z0-9_-]+$/;
      if (!usernameRegex.test(updateData.username)) {
        return {
          success: false,
          error: "사용자 이름은 영문, 숫자, 밑줄, 하이픈만 사용할 수 있습니다.",
          data: null,
        };
      }

      // Check length
      if (updateData.username.length < 3 || updateData.username.length > 20) {
        return {
          success: false,
          error: "사용자 이름은 3~20자 사이여야 합니다.",
          data: null,
        };
      }
    }

    // Update profile (RLS will ensure user can only update their own profile)
    const { data, error } = await supabase
      .from("user_profiles")
      .update(updateData)
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      return { success: false, error: error.message, data: null };
    }

    // Revalidate profile page
    revalidatePath("/profile", "page");

    return { success: true, data, error: null };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: "프로필 수정 중 오류가 발생했습니다.",
      data: null,
    };
  }
}

/**
 * Upload avatar to Supabase Storage
 */
export async function uploadAvatar(formData: FormData) {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "로그인이 필요합니다.", data: null };
    }

    const file = formData.get("avatar") as File;
    if (!file) {
      return { success: false, error: "파일을 선택해주세요.", data: null };
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: "JPG, PNG, GIF, WEBP 형식만 업로드 가능합니다.",
        data: null,
      };
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: "파일 크기는 2MB 이하여야 합니다.",
        data: null,
      };
    }

    // Create unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("user-avatars")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Error uploading avatar:", uploadError);
      return { success: false, error: uploadError.message, data: null };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from("user-avatars")
      .getPublicUrl(uploadData.path);

    // Update profile with new avatar URL
    const { data: profileData, error: profileError } = await supabase
      .from("user_profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", user.id)
      .select()
      .single();

    if (profileError) {
      console.error("Error updating profile with avatar:", profileError);
      return { success: false, error: profileError.message, data: null };
    }

    // Revalidate profile page
    revalidatePath("/profile", "page");

    return { success: true, data: { url: publicUrl }, error: null };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: "아바타 업로드 중 오류가 발생했습니다.",
      data: null,
    };
  }
}

/**
 * Get user's activity summary (reviews, likes, bookmarks count)
 */
export async function getUserActivitySummary() {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "로그인이 필요합니다.",
        data: { reviews: 0, likes: 0, bookmarks: 0 },
      };
    }

    // Get counts in parallel
    const [reviewsResult, likesResult, bookmarksResult] = await Promise.all([
      supabase
        .from("reviews")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase
        .from("user_likes")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_like", true),
      supabase
        .from("user_bookmarks")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id),
    ]);

    return {
      success: true,
      data: {
        reviews: reviewsResult.count || 0,
        likes: likesResult.count || 0,
        bookmarks: bookmarksResult.count || 0,
      },
      error: null,
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: "활동 요약을 불러오는 중 오류가 발생했습니다.",
      data: { reviews: 0, likes: 0, bookmarks: 0 },
    };
  }
}
