import { SectionIntro } from '../components/SectionIntro'

const principles = [
  [
    '01',
    'Start with the user’s task',
    'The technology matters most when it makes the work clearer.',
  ],
  [
    '02',
    'Treat quality as product work',
    'Accessibility, performance, and reliability belong in the experience.',
  ],
  [
    '03',
    'Prefer clarity over cleverness',
    'Clear systems and steady collaboration tend to outlast novelty.',
  ],
  [
    '04',
    'Stay close to implementation',
    'Good judgment depends on understanding the real tradeoffs.',
  ],
]

export function AboutPage() {
  return (
    <div className="section-shell page-stack">
      <SectionIntro
        eyebrow="About"
        title="Engineering with a wide lens and a close eye."
      >
        <p>
          I’m a software engineer who cares about useful products, well-made
          interfaces, and teams that turn complicated constraints into calm
          experiences.
        </p>
      </SectionIntro>

      <section
        className="prose-section ruled-section"
        aria-labelledby="story-heading"
      >
        <p className="eyebrow">The work</p>
        <div className="split-copy">
          <h2 id="story-heading">Front-end craft, widening outward.</h2>
          <div className="prose-column">
            <p>
              My work has centered on front-end architecture—React, TypeScript,
              and product engineering for enterprise and customer-service
              software—and it has been widening as AI reshapes how software gets
              built.
            </p>
            <p>
              I think of myself as an AI-native generalist: front-end remains my
              strongest craft, but I’m comfortable moving across the stack and
              into AI tooling to get the right thing shipped.
            </p>
            <p>
              At Microsoft, I’ve contributed to experiences spanning rich-text
              editing, AI-assisted service workflows, agent and conversation
              controls, and the diagnostic or reliability work that supports
              complex products.
            </p>
          </div>
        </div>
      </section>

      <section className="ruled-section" aria-labelledby="principles-heading">
        <p className="eyebrow">How I work</p>
        <h2 id="principles-heading">A few durable principles.</h2>
        <ol className="principles-grid">
          {principles.map(([number, title, description]) => (
            <li key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section
        className="outside-section ruled-section"
        aria-labelledby="outside-heading"
      >
        <div>
          <p className="eyebrow">Outside work</p>
          <h2 id="outside-heading">
            Endurance, landscapes, and making things.
          </h2>
        </div>
        <p>
          Trail running and ultrarunning keep me curious about endurance,
          landscapes, and incremental progress. I also enjoy mountains, skiing,
          camper and Tacoma projects, and building side projects for the
          pleasure of learning how things work.
        </p>
      </section>
    </div>
  )
}
