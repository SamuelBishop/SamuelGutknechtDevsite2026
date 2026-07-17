import { ArrowRight, PenLine } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SectionIntro } from '../components/SectionIntro'
import { formatPostDate, posts } from '../content/posts'

export function WrittenWorksPage() {
  return (
    <div className="section-shell page-stack">
      <SectionIntro eyebrow="Written Works" title="Ideas worth writing down.">
        <p>
          Essays and field notes on building software, running long, and the
          ideas that carry between them — published on Substack and mirrored
          here in full.
        </p>
      </SectionIntro>

      {posts.length === 0 ? (
        <section
          className="empty-projects"
          aria-labelledby="written-works-status-heading"
        >
          <div className="empty-icon" aria-hidden="true">
            <PenLine size={22} />
          </div>
          <p className="eyebrow">Drafting</p>
          <h2 id="written-works-status-heading">
            The first pieces are on their way.
          </h2>
          <p>
            New writing will appear here automatically as soon as it’s
            published. Check back soon.
          </p>
        </section>
      ) : (
        <ul className="post-grid" aria-label="Written works">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link className="post-card" to={`/written-works/${post.slug}`}>
                {post.coverImage ? (
                  <div className="post-card-media">
                    <img src={post.coverImage} alt="" loading="lazy" />
                  </div>
                ) : (
                  <div className="post-card-media post-card-media--empty">
                    <PenLine size={22} aria-hidden="true" />
                  </div>
                )}
                <div className="post-card-body">
                  <p className="post-meta">
                    <time dateTime={post.date}>
                      {formatPostDate(post.date)}
                    </time>
                    <span aria-hidden="true">·</span>
                    {post.readingTimeMin} min read
                  </p>
                  <h2>{post.title}</h2>
                  {post.excerpt ? (
                    <p className="post-excerpt">{post.excerpt}</p>
                  ) : null}
                  <span className="post-cta">
                    Read <ArrowRight size={16} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
