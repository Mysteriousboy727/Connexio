import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { supabase } from "@/lib/supabase";
import { signToken } from "@/lib/jwt";

function sanitizeUsernamePart(value: string) {
  const cleaned = value.toLowerCase().replace(/[^a-z0-9_]/g, "_").replace(/_+/g, "_");
  const trimmed = cleaned.replace(/^_+|_+$/g, "");
  return trimmed.slice(0, 30);
}

async function generateUniqueUsername(seed: string) {
  const base = sanitizeUsernamePart(seed) || `user_${randomUUID().slice(0, 8)}`;
  const candidates = [base];

  for (let i = 0; i < 10; i += 1) {
    const suffix = randomUUID().replace(/-/g, "").slice(0, 6 + i % 2);
    candidates.push(`${base.slice(0, Math.max(3, 30 - suffix.length - 1))}_${suffix}`);
  }

  for (const candidate of candidates) {
    const { data, error } = await supabase
      .from("users")
      .select("id")
      .eq("username", candidate)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return candidate;
    }
  }

  return `user_${randomUUID().replace(/-/g, "").slice(0, 12)}`;
}

function splitName(fullName?: string | null) {
  const trimmed = fullName?.trim() || "";
  if (!trimmed) {
    return { first_name: "", last_name: "" };
  }

  const [first_name, ...rest] = trimmed.split(/\s+/);
  return {
    first_name,
    last_name: rest.join(" "),
  };
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const accessToken = typeof body.access_token === "string" ? body.access_token : "";

  if (!accessToken) {
    return NextResponse.json({ error: "Missing Google access token" }, { status: 400 });
  }

  const {
    data: { user: googleUser },
    error: googleError,
  } = await supabase.auth.getUser(accessToken);

  if (googleError || !googleUser?.email) {
    return NextResponse.json({ error: "Unable to verify Google user" }, { status: 401 });
  }

  const email = googleUser.email;
  const metadata = googleUser.user_metadata ?? {};
  const fullName =
    metadata.full_name ||
    metadata.name ||
    [metadata.given_name, metadata.family_name].filter(Boolean).join(" ");
  const { first_name, last_name } = splitName(fullName);
  const avatar_url = typeof metadata.avatar_url === "string" ? metadata.avatar_url : null;

  const { data: existingUser, error: existingUserError } = await supabase
    .from("users")
    .select("id, email, username, first_name, last_name, avatar_url, created_at")
    .eq("email", email)
    .maybeSingle();

  if (existingUserError) {
    return NextResponse.json({ error: existingUserError.message }, { status: 500 });
  }

  let appUser = existingUser;

  if (!appUser) {
    const usernameSeed =
      (typeof metadata.user_name === "string" && metadata.user_name) ||
      (typeof metadata.preferred_username === "string" && metadata.preferred_username) ||
      email.split("@")[0];
    const username = await generateUniqueUsername(usernameSeed);
    const password_hash = await bcrypt.hash(randomUUID(), 10);

    const { data: insertedUser, error: insertError } = await supabase
      .from("users")
      .insert({
        email,
        username,
        first_name,
        last_name,
        avatar_url,
        password_hash,
        last_login: new Date().toISOString(),
      })
      .select("id, email, username, first_name, last_name, avatar_url, created_at")
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    appUser = insertedUser;
  } else {
    const updates: Record<string, string> = {
      last_login: new Date().toISOString(),
    };

    if (!appUser.first_name && first_name) updates.first_name = first_name;
    if (!appUser.last_name && last_name) updates.last_name = last_name;
    if (!appUser.avatar_url && avatar_url) updates.avatar_url = avatar_url;

    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update(updates)
      .eq("id", appUser.id)
      .select("id, email, username, first_name, last_name, avatar_url, created_at")
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    appUser = updatedUser;
  }

  const token = await signToken({ userId: appUser.id, email: appUser.email });
  return NextResponse.json({ token, user: appUser });
}
