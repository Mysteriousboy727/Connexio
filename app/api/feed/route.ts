import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getUserFromRequest } from '@/lib/auth-utils'

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  const { searchParams } = new URL(req.url)
  const page = Math.max(1, Number(searchParams.get('page') ?? 1))
  const limit = 10
  const from = (page - 1) * limit

  // If logged in + follows exist, show followed users' posts; else show all
  if (user) {
    const { data: follows } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', user.userId)

    if (follows && follows.length > 0) {
      const ids = follows.map(f => f.following_id)
      const { data, error } = await supabase
        .from('posts')
        .select('*, author:users(id, username, avatar_url)')
        .in('author_id', ids)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .range(from, from + limit - 1)

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ data, page, limit })
    }
  }

  // Fallback: all public posts
  const { data, error } = await supabase
    .from('posts')
    .select('*, author:users(id, username, avatar_url)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data, page, limit })
}