import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabase } from '@/lib/supabase'
import { signToken } from '@/lib/jwt'

export async function POST(req: NextRequest) {
  const { email, username, password } = await req.json()

  if (!password || (!email && !username))
    return NextResponse.json({ error: 'Provide email or username + password' }, { status: 400 })

  let query = supabase.from('users').select('*')
  
  if (email) {
    query = query.eq('email', email)
  } else {
    query = query.eq('username', username)
  }
  
  const { data: users, error } = await query

  if (error || !users || users.length === 0)
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

  const user = users[0]
  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid)
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

  await supabase
    .from('users')
    .update({ last_login: new Date().toISOString() })
    .eq('id', user.id)

  const token = await signToken({ userId: user.id, email: user.email })
  const { password_hash: _, ...safeUser } = user
  return NextResponse.json({ token, user: safeUser })
}