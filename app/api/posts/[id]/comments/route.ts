import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getUserFromRequest } from '@/lib/auth-utils'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: post_id } = await params

  const { data, error } = await supabase
    .from('comments')
    .select('*, user:users(id, username, avatar_url)')
    .eq('post_id', post_id)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: post_id } = await params
  const { content } = await req.json()

  if (!content?.trim())
    return NextResponse.json({ error: 'Comment content required' }, { status: 400 })

  const { data, error } = await supabase
    .from('comments')
    .insert({ user_id: user.userId, post_id, content })
    .select('*, user:users(id, username, avatar_url)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}