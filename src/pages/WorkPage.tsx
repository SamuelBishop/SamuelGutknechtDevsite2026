import { SectionIntro } from '../components/SectionIntro'
import { WorkCard } from '../components/WorkCard'
import { workItems } from '../content/siteContent'

export function WorkPage() {
  return (
    <div className="section-shell page-stack">
      <SectionIntro
        eyebrow="Professional work"
        title="Complex products, made more understandable."
      >
        <p>
          Selected examples of product and engineering work. These are
          intentionally concise and limited to information that can be shared
          publicly.
        </p>
      </SectionIntro>
      <div className="work-list" aria-label="Selected professional work">
        {workItems.map((item) => (
          <WorkCard key={item.title} item={item} />
        ))}
      </div>
      <p className="confidentiality-note">
        The work shown here favors useful context over internal detail. Specific
        scope, outcomes, and imagery will be added only when they can be
        represented accurately and shared publicly.
      </p>
    </div>
  )
}
