import type { WorkItem } from '../content/siteContent'

export function WorkCard({ item }: { item: WorkItem }) {
  return (
    <article className="work-card">
      <div className="card-kind" aria-hidden="true">
        {item.kind}
      </div>
      <div className="card-content">
        <div className="work-media-slot" aria-hidden="true">
          <span>Project image forthcoming</span>
        </div>
        <h2>{item.title}</h2>
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
