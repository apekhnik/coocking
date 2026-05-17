import { auth } from '@clerk/nextjs/server'
import { getRecipesWithRelations } from '@/actions/recipes'
import { generateRecipeDocument } from '@/lib/docx-service'

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const recipes = await getRecipesWithRelations()
  const buffer = await generateRecipeDocument(recipes)
  const uint8 = new Uint8Array(buffer)

  return new Response(uint8, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': 'attachment; filename="recipes.docx"',
    },
  })
}
