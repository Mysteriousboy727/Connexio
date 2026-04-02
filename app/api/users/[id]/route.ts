import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data, error } = await supabase
    .from('users')
    .select('id, username, first_name, last_name, bio, avatar_url, website, location, created_at')
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { count: posts_count, error: postsError } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('author_id', id)
    .eq('is_active', true)

  if (postsError) return NextResponse.json({ error: postsError.message }, { status: 500 })

  return NextResponse.json({ ...data, posts_count })
}
