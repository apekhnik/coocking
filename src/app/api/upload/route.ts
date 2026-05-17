import { auth } from '@clerk/nextjs/server'
import { put } from '@vercel/blob'

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) return new Response('Unauthorized', { status: 401 })

  const form = await request.formData()
  const file = form.get('file') as File
  if (!file) return new Response('No file', { status: 400 })

  const ext = file.name.split('.').pop() ?? 'jpg'
  const blob = await put(`recipes/${userId}/${Date.now()}.${ext}`, file, {
    access: 'public',
    contentType: file.type,
  })

  return Response.json({ url: blob.url })
}
