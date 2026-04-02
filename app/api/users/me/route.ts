import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getUserFromRequest } from '@/lib/auth-utils'
import { isValidUsername } from '@/lib/validators'

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('users')
    .select('id, email, username, first_name, last_name, bio, avatar_url, website, location, created_at')
    .eq('id', user.userId)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const allowed = ['bio', 'avatar_url', 'website', 'location', 'first_name', 'last_name', 'username']
  const updates: Record<string, string> = {}

  for (const key of allowed) {
    if (body[key] !== undefined) updates[key] = body[key]
  }

  if (Object.keys(updates).length === 0)
    return NextResponse.json({ error: 'No valid profile fields provided' }, { status: 400 })

  if (updates.bio && updates.bio.length > 160)
    return NextResponse.json({ error: 'Bio max 160 chars' }, { status: 400 })

  if (updates.username && !isValidUsername(updates.username))
    return NextResponse.json(
      { error: 'Username must be 3-30 chars, letters/numbers/underscore only' },
      { status: 400 }
    )

  if (updates.username) {
    const { data: existingUser, error: existingUserError } = await supabase
      .from('users')
      .select('id')
      .eq('username', updates.username)
      .neq('id', user.userId)
      .maybeSingle()

    if (existingUserError)
      return NextResponse.json({ error: existingUserError.message }, { status: 500 })

    if (existingUser)
      return NextResponse.json({ error: 'Username already taken' }, { status: 409 })
  }

  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', user.userId)
    .select('id, email, username, first_name, last_name, bio, avatar_url, website, location')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
