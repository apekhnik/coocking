import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx'
interface RecipeWithRelations {
  id: string
  title: string
  createdAt: Date
  steps: { body: string; position: number }[]
  ingredients: { qty: string; unit: string; item: string; position: number }[]
}

interface ParsedRecipe {
  title: string
  description: string
  ingredients: string
}

export async function parseDocxToRecipes(buffer: Buffer): Promise<ParsedRecipe[]> {
  const mammoth = await import('mammoth')
  const { value: text } = await mammoth.extractRawText({ buffer })

  const start = text.indexOf('===DATA_JSON_START===')
  const end = text.indexOf('===DATA_JSON_END===')

  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Файл не містить даних рецептів')
  }

  const jsonBlock = text.substring(start + '===DATA_JSON_START==='.length, end).trim()

  try {
    return JSON.parse(jsonBlock) as ParsedRecipe[]
  } catch {
    throw new Error('Не вдалося прочитати дані з файлу')
  }
}

export async function generateRecipeDocument(recipes: RecipeWithRelations[]): Promise<Buffer> {
  const sections: Paragraph[] = []

  for (const recipe of recipes) {
    const description = recipe.steps
      .sort((a, b) => a.position - b.position)
      .map(s => s.body)
      .join('\n\n')

    const ingredientsText = recipe.ingredients
      .sort((a, b) => a.position - b.position)
      .map(i => [i.qty, i.unit, i.item].filter(Boolean).join(' '))
      .join('\n')

    sections.push(new Paragraph({ pageBreakBefore: true }))

    sections.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
        children: [
          new TextRun({
            text: recipe.title,
            font: 'Comfortaa',
            size: 48,
            bold: true,
            color: '2e30b5',
          }),
        ],
      })
    )

    sections.push(
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({ text: 'Описание: ', bold: true, font: 'Comfortaa', size: 28, color: '2e30b5' }),
          new TextRun({ text: description || '-', font: 'Roboto', size: 28 }),
        ],
      })
    )

    sections.push(
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({ text: 'Ингредиенты:', bold: true, font: 'Roboto', size: 28 }),
        ],
      })
    )

    for (const line of ingredientsText.split('\n')) {
      if (line.trim()) {
        sections.push(
          new Paragraph({
            spacing: { after: 50 },
            bullet: { level: 0 },
            children: [
              new TextRun({ text: line.trim(), font: 'Roboto', size: 28 }),
            ],
          })
        )
      }
    }
  }

  const jsonData = recipes.map(r => ({
    id: r.id,
    title: r.title,
    description: r.steps
      .sort((a, b) => a.position - b.position)
      .map(s => s.body)
      .join('\n\n'),
    ingredients: r.ingredients
      .sort((a, b) => a.position - b.position)
      .map(i => [i.qty, i.unit, i.item].filter(Boolean).join(' '))
      .join('\n'),
    createdAt: r.createdAt.toISOString(),
  }))

  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `===DATA_JSON_START===\n${JSON.stringify(jsonData, null, 2)}\n===DATA_JSON_END===`,
          size: 1,
          color: 'FFFFFF',
        }),
      ],
    })
  )

  const doc = new Document({ sections: [{ children: sections }] })
  return Buffer.from(await Packer.toBuffer(doc))
}
