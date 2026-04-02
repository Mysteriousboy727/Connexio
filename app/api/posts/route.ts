import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getUserFromRequest } from '@/lib/auth-utils'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = Math.max(1, Number(searchParams.get('page') ?? 1))
  const authorId = searchParams.get('author_id')
  const limit = 10
  const from = (page - 1) * limit

  let query = supabase
    .from('posts')
    .select('*, author:users(id, username, avatar_url)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1)

  if (authorId) query = query.eq('author_id', authorId)

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data, page, limit })
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const contentType = req.headers.get('content-type') ?? ''

  let content = ''
  let image_url: string | null = null

  if (contentType.includes('multipart/form-data')) {
    const formData = await req.formData()
    content = (formData.get('content') as string) ?? ''
    const image = formData.get('image') as File | null

    if (image) {
      if (!['image/jpeg', 'image/png'].includes(image.type))
        return NextResponse.json({ error: 'Only JPEG/PNG allowed' }, { status: 400 })
      if (image.size > 2 * 1024 * 1024)
        return NextResponse.json({ error: 'Max image size is 2MB' }, { status: 400 })

      const ext = image.type === 'image/png' ? 'png' : 'jpg'
      const path = `posts/${user.userId}/${Date.now()}.${ext}`
      const bytes = await image.arrayBuffer()

      const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET?.trim() || 'images'
      const { error: uploadErr } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(path, bytes, { contentType: image.type })

      if (uploadErr) {
        const message = uploadErr.message || 'Upload failed'
        return NextResponse.json({ error: message.startsWith('Bucket not found') ? 'Storage bucket not found. Please set SUPABASE_STORAGE_BUCKET correctly.' : message }, { status: 500 })
      }

      const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
      image_url = urlData.publicUrl
    }
  } else {
    const body = await req.json()
    content = body.content ?? ''
    image_url = body.image_url ?? null
  }

  if (!content || content.length > 280)
    return NextResponse.json({ error: 'Content required, max 280 chars' }, { status: 400 })

  const { data, error } = await supabase
    .from('posts')
    .insert({ content, author_id: user.userId, image_url })
    .select('*, author:users(id, username, avatar_url)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
