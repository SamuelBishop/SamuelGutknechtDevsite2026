import generated from './posts.generated.json'

export type Post = {
  slug: string
  title: string
  url: string
  // ISO 8601 publication date.
  date: string
  author: string
  excerpt: string
  coverImage: string | null
  readingTimeMin: number
  // Sanitized HTML built at generate time (see scripts/generate-posts.mjs).
  contentHtml: string
}

type PostsFile = {
  generatedAt: string
  source: string
  posts: Post[]
}

const file = generated as PostsFile

// Newest first; the generator already sorts, but keep the guarantee here too.
export const posts: Post[] = [...file.posts].sort((a, b) =>
  a.date < b.date ? 1 : a.date > b.date ? -1 : 0,
)

export const postsSource = file.source

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug)
}

export function formatPostDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.valueOf())) return ''
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
