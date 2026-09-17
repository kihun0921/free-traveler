import { createClient } from "@/lib/supabase/server";

interface UserProfile {
  id: string;
  email: string;
  nickname: string;
  is_adult: boolean;
  adult_verified_at: string | null;
  age_group: string | null;
  gender: string | null;
  travel_style: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("user_profile")
    .select("*")
    .eq("id", user.id)
    .single();

  return {
    ...user,
    profile: profile as UserProfile | null,
  };
}

export async function createUserProfile(userId: string, email: string) {
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("user_profile")
    .insert({
      id: userId,
      email,
      nickname: email.split("@")[0],
      is_adult: false,
      adult_verified_at: null,
      age_group: null,
      gender: null,
      travel_style: null,
      status: "active",
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create user profile: ${error.message}`);
  }

  return profile as UserProfile;
}

export async function updateAdultVerification(
  userId: string,
  isAdult: boolean,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_profile")
    .update({
      is_adult: isAdult,
      adult_verified_at: isAdult ? new Date().toISOString() : null,
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update adult verification: ${error.message}`);
  }

  return data as UserProfile;
}
