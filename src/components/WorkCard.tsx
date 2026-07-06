import { Image } from 'lucide-react'
import type { WorkItem } from '../content/siteContent'

export function WorkCard({ item }: { item: WorkItem; index: number }) {
  return (
    <article className="work-card">
      <div className="card-kind" aria-hidden="true">
        {item.kind}
      </div>
      <div className="card-content">
        <div className="card-media media-placeholder" aria-hidden="true">
          <Image size={22} aria-hidden="true" />
          <span className="media-label">Project image</span>
        </div>
        <div className="card-heading">
          <h2>{item.title}</h2>
          <span className="status">Case study in progress</span>
        </div>
        <p className="card-context">{item.context}</p>
        <p>{item.contribution}</p>
        <ul className="tag-list" aria-label="Focus areas">
          {item.focusAreas.map((area) => (
            <li key={area}>{area}</li>
          ))}
        </ul>
      </div>
    </article>
  )
}
