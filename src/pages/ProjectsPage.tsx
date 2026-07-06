import { Wrench } from 'lucide-react'
import { SectionIntro } from '../components/SectionIntro'

export function ProjectsPage() {
  return (
    <div className="section-shell page-stack">
      <SectionIntro
        eyebrow="Projects"
        title="Built from curiosity, utility, or both."
      >
        <p>
          Side projects, practical experiments, and things built to explore an
          idea. A small, honest collection is better than a padded catalog.
        </p>
      </SectionIntro>
      <section
        className="empty-projects"
        aria-labelledby="projects-status-heading"
      >
        <div className="empty-icon" aria-hidden="true">
          <Wrench size={22} />
        </div>
        <p className="eyebrow">Workbench status</p>
        <h2 id="projects-status-heading">
          The projects are real. The write-ups are catching up.
        </h2>
        <p>
          I’m documenting a small set of side projects with enough context to be
          useful: why each exists, what I built, and what I learned. They’ll
          appear here when the details and links are ready to share.
        </p>
        <div className="project-categories" aria-label="Future project areas">
          <span>Software experiments</span>
          <span>Camper / Tacoma builds</span>
          <span>Useful little tools</span>
        </div>
      </section>
    </div>
  )
}
