import type { WorkItem } from '../content/siteContent'

export function WorkCard({ item, index }: { item: WorkItem; index: number }) {
  return (
    <article className="work-card">
      <div className="card-number" aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </div>
      <div className="card-content">
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
