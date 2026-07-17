import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { formatPostDate, getPostBySlug } from '../content/posts'

export function WrittenWorkPage() {
  const { slug } = useParams()
  const post = slug ? getPostBySlug(slug) : undefined

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Samuel Gutknecht`
      document
        .querySelector('meta[name="description"]')
        ?.setAttribute(
          'content',
          post.excerpt || `A written work by ${post.author}.`,
        )
    } else {
      document.title = 'Written work not found | Samuel Gutknecht'
    }
  }, [post])

  if (!post) {
    return (
      <section className="section-shell not-found">
        <p className="eyebrow">Not found</p>
        <h1>That written work isn’t here.</h1>
        <p>The piece may have moved, or the link may be out of date.</p>
        <Link className="text-link" to="/written-works">
          <ArrowLeft aria-hidden="true" size={17} /> Back to written works
        </Link>
      </section>
    )
  }

  return (
    <article className="section-shell post-article page-stack">
      <div className="post-article-head">
        <Link className="text-link post-back" to="/written-works">
          <ArrowLeft aria-hidden="true" size={17} /> Written works
        </Link>
        <p className="eyebrow">Written Works</p>
        <h1>{post.title}</h1>
        <p className="post-meta">
          <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          <span aria-hidden="true">·</span>
          {post.readingTimeMin} min read
          {post.author ? (
            <>
              <span aria-hidden="true">·</span>
              {post.author}
            </>
          ) : null}
        </p>
      </div>

      {post.coverImage ? (
        <img className="post-cover" src={post.coverImage} alt="" />
      ) : null}

      <div
        className="post-content"
        // Content is sanitized at build time in scripts/generate-posts.mjs.
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />

      <div className="post-footer-links">
        <a
          className="text-link"
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Read on Substack <ArrowUpRight aria-hidden="true" size={16} />
        </a>
        <Link className="text-link" to="/written-works">
          <ArrowLeft aria-hidden="true" size={17} /> All written works
        </Link>
      </div>
    </article>
  )
}
