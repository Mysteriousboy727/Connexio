import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabase } from '@/lib/supabase'
import { signToken } from '@/lib/jwt'
import { isValidUsername, isValidEmail } from '@/lib/validators'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { email, username, password, first_name, last_name } = body

  if (!email || !username || !password)
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

  if (!isValidEmail(email))
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })

  if (!isValidUsername(username))
    return NextResponse.json(
      { error: 'Username must be 3-30 chars, letters/numbers/underscore only' },
      { status: 400 }
    )

  if (password.length < 6)
    return NextResponse.json({ error: 'Password must be at least 6 chars' }, { status: 400 })

  const password_hash = await bcrypt.hash(password, 10)

  const { data, error } = await supabase
    .from('users')
    .insert({ email, username, password_hash, first_name, last_name })
    .select('id, email, username, first_name, last_name, created_at')
    .single()

  if (error) {
    if (error.code === '23505')
      return NextResponse.json({ error: 'Email or username already taken' }, { status: 409 })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const token = await signToken({ userId: data.id, email: data.email })
  return NextResponse.json({ token, user: data }, { status: 201 })
}