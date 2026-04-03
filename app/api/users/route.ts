import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search = (searchParams.get('search') || searchParams.get('q') || '').trim()

  let query = supabase
    .from('users')
    .select('id, username, first_name, last_name, avatar_url, bio')
    .order('created_at', { ascending: false })
    .limit(20)

  if (search) {
    query = query.or(
      `username.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`
    )
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
