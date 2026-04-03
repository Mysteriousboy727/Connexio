import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getUserFromRequest } from '@/lib/auth-utils'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Verify user exists in database
  const { data: userExists, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('id', user.userId)
    .single()

  if (userError || !userExists) {
    return NextResponse.json({ error: 'User not found. Please log out and log back in.' }, { status: 401 })
  }

  const { id: post_id } = await params

  const { error } = await supabase
    .from('likes')
    .insert({ user_id: user.userId, post_id })

  if (error) {
    if (error.code === '23505')
      return NextResponse.json({ error: 'Already liked' }, { status: 409 })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Liked' }, { status: 201 })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: post_id } = await params

  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('user_id', user.userId)
    .eq('post_id', post_id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ message: 'Unliked' })
}