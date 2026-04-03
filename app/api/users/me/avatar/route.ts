import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getUserFromRequest } from '@/lib/auth-utils'

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('avatar') as File | null

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  if (!['image/jpeg', 'image/png'].includes(file.type))
    return NextResponse.json({ error: 'Only JPEG/PNG allowed' }, { status: 400 })
  if (file.size > 2 * 1024 * 1024)
    return NextResponse.json({ error: 'Max 2MB' }, { status: 400 })

  const ext = file.type === 'image/png' ? 'png' : 'jpg'
  const path = `avatars/${user.userId}.${ext}`
  const bytes = await file.arrayBuffer()

  const { error: uploadErr } = await supabase.storage
    .from('images')
    .upload(path, bytes, { contentType: file.type, upsert: true })

  if (uploadErr) return NextResponse.json({ error: uploadErr.message }, { status: 500 })

  const { data: urlData } = supabase.storage.from('images').getPublicUrl(path)

  await supabase
    .from('users')
    .update({ avatar_url: urlData.publicUrl })
    .eq('id', user.userId)

  return NextResponse.json({ avatar_url: urlData.publicUrl })
}