import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getUserFromRequest } from "@/lib/auth-utils";

async function areMutualFriends(userId: string, otherUserId: string) {
  const [aToB, bToA] = await Promise.all([
    supabase
      .from("follows")
      .select("follower_id")
      .eq("follower_id", userId)
      .eq("following_id", otherUserId)
      .maybeSingle(),
    supabase
      .from("follows")
      .select("follower_id")
      .eq("follower_id", otherUserId)
      .eq("following_id", userId)
      .maybeSingle(),
  ]);

  if (aToB.error) throw aToB.error;
  if (bToA.error) throw bToA.error;

  return Boolean(aToB.data && bToA.data);
}

function relationMissing(error: { message?: string; code?: string } | null) {
  return error?.code === "42P01" || error?.message?.toLowerCase().includes("messages");
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: otherUserId } = await params;
  if (!(await areMutualFriends(user.userId, otherUserId))) {
    return NextResponse.json({ error: "Only mutual friends can message each other" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("messages")
    .select("id, sender_id, receiver_id, content, created_at, is_read")
    .or(
      `and(sender_id.eq.${user.userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.userId})`
    )
    .order("created_at", { ascending: true });

  if (error) {
    if (relationMissing(error)) {
      return NextResponse.json(
        { error: "Messages are not set up yet. Run the SQL in db/messages.sql in Supabase." },
        { status: 500 }
      );
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("receiver_id", user.userId)
    .eq("sender_id", otherUserId);

  return NextResponse.json(data || []);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: otherUserId } = await params;
  if (!(await areMutualFriends(user.userId, otherUserId))) {
    return NextResponse.json({ error: "Only mutual friends can message each other" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const content = typeof body.content === "string" ? body.content.trim() : "";

  if (!content) {
    return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 });
  }

  if (content.length > 2000) {
    return NextResponse.json({ error: "Message is too long" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("messages")
    .insert({
      sender_id: user.userId,
      receiver_id: otherUserId,
      content,
    })
    .select("id, sender_id, receiver_id, content, created_at, is_read")
    .single();

  if (error) {
    if (relationMissing(error)) {
      return NextResponse.json(
        { error: "Messages are not set up yet. Run the SQL in db/messages.sql in Supabase." },
        { status: 500 }
      );
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
