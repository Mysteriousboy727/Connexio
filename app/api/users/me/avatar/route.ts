import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getUserFromRequest } from '@/lib/auth-utils'

const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET?.trim() || 'images'

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
    .from(STORAGE_BUCKET)
    .upload(path, bytes, { contentType: file.type, upsert: true })

  if (uploadErr) {
    const message = uploadErr.message || 'Upload failed'
    return NextResponse.json({ error: message.startsWith('Bucket not found') ? 'Storage bucket not found. Please set SUPABASE_STORAGE_BUCKET correctly.' : message }, { status: 500 })
  }

  const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)

  const { error: updateErr } = await supabase
    .from('users')
    .update({ avatar_url: urlData.publicUrl })
    .eq('id', user.userId)

  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 })

  return NextResponse.json({ avatar_url: urlData.publicUrl })
}
