const KEYWORD_MAP: [string, string][] = [
  ['пирог',     'pie,baking,pastry'],
  ['торт',      'cake,celebration,dessert'],
  ['медовик',   'honey,cake,layers'],
  ['брауни',    'brownie,chocolate,fudge'],
  ['кекс',      'cupcake,muffin,baking'],
  ['тісто',     'dough,pastry,baking'],
  ['тесто',     'dough,pastry,baking'],
  ['вареник',   'dumplings,pasta,boiled'],
  ['пряник',    'gingerbread,cookies,spice'],
  ['печиво',    'cookies,baking,sweet'],
  ['оладь',     'pancakes,fritters,breakfast'],
  ['штрудел',   'strudel,pastry,apple'],
  ['пампушк',   'bread,buns,garlic'],
  ['паска',     'bread,loaf,easter'],
  ['салат',     'salad,fresh,vegetables'],
  ['суп',       'soup,broth,warm'],
  ['курк',      'chicken,poultry,roasted'],
  ['куриц',     'chicken,poultry,roasted'],
  ['кабанос',   'sausage,cured,meat'],
  ['шоколад',   'chocolate,dessert,dark'],
  ['яблук',     'apple,fruit,pie'],
  ['яблоч',     'apple,fruit,cider'],
  ['слив',      'plum,fruit,purple'],
  ['имбир',     'ginger,spice,cookie'],
  ['греч',      'salad,mediterranean,fresh'],
]

export function getKeywords(title: string): string {
  const lower = title.toLowerCase()
  for (const [key, val] of KEYWORD_MAP) {
    if (lower.includes(key)) return val
  }
  return 'food,cooking,delicious'
}

export async function fetchFoodImageUrl(title: string): Promise<string> {
  const keywords = getKeywords(title)
  const sourceUrl = `https://source.unsplash.com/800x500/?${encodeURIComponent(keywords)}`
  try {
    const res = await fetch(sourceUrl, { redirect: 'follow' })
    if (res.ok && res.url.includes('unsplash.com')) {
      // strip query params except w/q for clean storage
      const url = new URL(res.url)
      url.searchParams.set('w', '800')
      url.searchParams.set('q', '80')
      url.searchParams.set('fit', 'crop')
      return url.toString()
    }
  } catch {
    // fall through to empty string
  }
  return ''
}
