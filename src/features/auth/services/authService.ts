import type { AuthResponse, User } from "@supabase/supabase-js";
import { requireSupabaseClient } from "@/lib/supabaseClient";

export type AuthCredentials = {
  email: string;
  password: string;
};

export async function getCurrentUser(): Promise<User | null> {
  const client = requireSupabaseClient();
  const { data, error } = await client.auth.getUser();

  if (error) {
    throw error;
  }

  return data.user;
}

export async function signIn(credentials: AuthCredentials): Promise<AuthResponse> {
  const client = requireSupabaseClient();
  const response = await client.auth.signInWithPassword(credentials);

  if (response.error) {
    throw response.error;
  }

  return response;
}

export async function signUp(credentials: AuthCredentials): Promise<AuthResponse> {
  const client = requireSupabaseClient();
  const response = await client.auth.signUp(credentials);

  if (response.error) {
    throw response.error;
  }

  return response;
}

export async function signOut(): Promise<void> {
  const client = requireSupabaseClient();
  const { error } = await client.auth.signOut();

  if (error) {
    throw error;
  }
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  const client = requireSupabaseClient();

  return client.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
}
