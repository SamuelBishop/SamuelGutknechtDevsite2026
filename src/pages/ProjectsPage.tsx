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
        className="featured-project"
        aria-labelledby="numpad-project-heading"
      >
        <figure className="featured-project-media">
          <img
            src="/photos/hotswap-numpad-pcb.jpg"
            alt="A custom hot-swappable numpad keyboard PCB connected to a laptop"
          />
        </figure>
        <div className="featured-project-copy">
          <p className="eyebrow">Electronics project</p>
          <h2 id="numpad-project-heading">
            A hot-swappable numpad, built from the circuit up.
          </h2>
          <p>
            A hands-on keyboard project that brought circuit design, component
            layout, assembly, and practical debugging into one working
            prototype.
          </p>
          <div className="project-categories" aria-label="Project focus areas">
            <span>PCB design</span>
            <span>Keyboard hardware</span>
            <span>Prototyping</span>
          </div>
        </div>
      </section>
    </div>
  )
}
