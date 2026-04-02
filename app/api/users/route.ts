import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q')?.trim()

  let request = supabase
    .from('users')
    .select('id, username, first_name, last_name, avatar_url, bio')
    .order('created_at', { ascending: false })

  if (query) {
    request = request.or(
      `username.ilike.%${query}%,first_name.ilike.%${query}%,last_name.ilike.%${query}%`
    )
  }

  const { data, error } = await request

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
