import type { WorkItem } from '../content/siteContent'

export function WorkCard({ item }: { item: WorkItem }) {
  return (
    <article className="work-card">
      <div className="card-kind" aria-hidden="true">
        {item.kind}
      </div>
      <div className="card-content">
        {item.video ? (
          <figure className="work-media-slot has-video">
            <video
              src={item.video.src}
              poster={item.video.poster}
              controls
              preload="none"
              playsInline
              aria-label={item.video.title}
            />
          </figure>
        ) : item.image ? (
          <figure className="work-media-slot has-image">
            <img
              src={item.image.src}
              alt={item.image.alt}
              loading="lazy"
              data-fit={item.image.fit ?? 'cover'}
              style={
                item.image.objectPosition
                  ? { objectPosition: item.image.objectPosition }
                  : undefined
              }
            />
          </figure>
        ) : (
          <div className="work-media-slot" aria-hidden="true">
            <span>Project image forthcoming</span>
          </div>
        )}
        <h2>{item.title}</h2>
        <p className="card-context">{item.context}</p>
        <p>{item.contribution}</p>
        <ul className="tag-list" aria-label="Focus areas">
          {item.focusAreas.map((area) => (
            <li key={area}>{area}</li>
          ))}
        </ul>
        {item.links ? (
          <ul className="card-links" aria-label="References">
            {item.links.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  )
}
