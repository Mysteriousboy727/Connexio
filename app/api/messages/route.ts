import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getUserFromRequest } from "@/lib/auth-utils";

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [followingRes, followersRes] = await Promise.all([
    supabase.from("follows").select("following_id").eq("follower_id", user.userId),
    supabase.from("follows").select("follower_id").eq("following_id", user.userId),
  ]);

  if (followingRes.error)
    return NextResponse.json({ error: followingRes.error.message }, { status: 500 });
  if (followersRes.error)
    return NextResponse.json({ error: followersRes.error.message }, { status: 500 });

  const followingIds = new Set((followingRes.data || []).map(r => r.following_id));
  const friendIds = (followersRes.data || [])
    .map(r => r.follower_id)
    .filter(id => followingIds.has(id));

  if (friendIds.length === 0) return NextResponse.json([]);

  const [friendsResult, messagesResult] = await Promise.all([
    supabase
      .from("users")
      .select("id, username, first_name, last_name, avatar_url")
      .in("id", friendIds),
    supabase
      .from("messages")
      .select("id, sender_id, receiver_id, content, created_at")
      .or(`sender_id.eq.${user.userId},receiver_id.eq.${user.userId}`)
      .order("created_at", { ascending: false })
      .limit(500),
  ]);

  if (friendsResult.error)
    return NextResponse.json({ error: friendsResult.error.message }, { status: 500 });
  if (messagesResult.error)
    return NextResponse.json({ error: messagesResult.error.message }, { status: 500 });

  const latestByFriend = new Map();
  for (const msg of messagesResult.data || []) {
    const friendId = msg.sender_id === user.userId ? msg.receiver_id : msg.sender_id;
    if (!friendIds.includes(friendId)) continue;
    if (!latestByFriend.has(friendId)) {
      latestByFriend.set(friendId, {
        content: msg.content,
        created_at: msg.created_at,
        sender_id: msg.sender_id,
      });
    }
  }

  const conversations = (friendsResult.data || [])
    .map(friend => ({
      friend: {
        id: friend.id,
        name: `${friend.first_name || ""} ${friend.last_name || ""}`.trim() || friend.username,
        handle: `@${friend.username}`,
        avatar: friend.avatar_url || "https://i.pravatar.cc/40",
      },
      last_message: latestByFriend.get(friend.id) || null,
    }))
    .sort((a, b) => {
      if (a.last_message && b.last_message)
        return new Date(b.last_message.created_at).getTime() - new Date(a.last_message.created_at).getTime();
      if (a.last_message) return -1;
      if (b.last_message) return 1;
      return a.friend.name.localeCompare(b.friend.name);
    });

  return NextResponse.json(conversations);
}