import { PhotoCarousel, type PhotoStoryItem } from '../components/PhotoCarousel'
import { SectionIntro } from '../components/SectionIntro'
import { SocialLinks } from '../components/SocialLinks'

const principles = [
  [
    'Start with the user’s task',
    'The technology matters most when it makes the work clearer.',
  ],
  [
    'Treat quality as product work',
    'Accessibility, performance, and reliability belong in the experience.',
  ],
  [
    'Prefer clarity over cleverness',
    'Clear systems and steady collaboration tend to outlast novelty.',
  ],
  [
    'Stay close to implementation',
    'Good judgment depends on understanding the real tradeoffs.',
  ],
]

const personalMoments: [PhotoStoryItem, ...PhotoStoryItem[]] = [
  {
    src: '/photos/graduation-selfie.jpg',
    alt: 'Samuel in his graduation cap and gown',
    title: 'Graduation day',
    description:
      'Electrical and computer engineering gave me a practical foundation across software, systems, and electronics.',
    fit: 'contain',
  },
  {
    src: '/photos/engineering-graduation.jpg',
    alt: 'Samuel outside the University of Missouri engineering laboratories after graduation',
    title: 'An engineering foundation',
    description:
      'Graduating from the University of Missouri marked the start of a career built around useful systems.',
    fit: 'contain',
  },
  {
    src: '/photos/microsoft-campus.jpg',
    alt: 'Samuel visiting the Microsoft campus',
    title: 'Building at scale',
    description:
      'My work at Microsoft has widened from front-end craft into product engineering, cloud systems, and AI.',
    objectPosition: '50% 54%',
  },
  {
    src: '/photos/sunflower-trail-race.jpg',
    alt: 'Samuel running a trail race through a sunflower field',
    title: 'Miles outside',
    description:
      'Trail running and ultrarunning keep me close to the landscapes I want to understand and protect.',
    objectPosition: '50% 52%',
  },
  {
    src: '/photos/coastal-trail-family.jpg',
    alt: 'Samuel with his wife and their dog on a coastal trail',
    title: 'My favorite crew',
    description:
      'The best days usually include my wife, our dog, and enough trail to make the destination feel earned.',
    fit: 'contain',
  },
  {
    src: '/photos/hotswap-numpad-pcb.jpg',
    alt: 'A custom hot-swappable numpad keyboard PCB connected to a laptop',
    title: 'At the workbench',
    description:
      'I like making physical things too, including a hot-swappable numpad PCB built as a hands-on electronics project.',
    fit: 'contain',
  },
]

export function AboutPage() {
  return (
    <div className="section-shell page-stack">
      <SectionIntro
        eyebrow="About"
        title="Engineering with a wide lens and a close eye."
      >
        <p>
          I’m a software engineer who cares about useful products, clear
          interfaces, and teams that turn complicated constraints into calm
          experiences.
        </p>
      </SectionIntro>

      <section
        className="prose-section ruled-section"
        aria-labelledby="story-heading"
      >
        <div className="split-copy">
          <div>
            <h2 id="story-heading">Front-end craft, widening outward.</h2>
            <figure className="about-portrait">
              <img
                src="/photos/coastal-trail-family.jpg"
                alt="Samuel with his wife and their dog on a coastal trail"
                loading="lazy"
              />
            </figure>
            <div className="about-social">
              <p className="about-social-label">Find me around the web</p>
              <SocialLinks />
            </div>
          </div>
          <div className="prose-column">
            <p>
              My work has centered on front-end architecture, React, TypeScript,
              and product engineering for enterprise and customer-service
              software. It has been widening as AI changes how software gets
              built.
            </p>
            <p>
              Front-end remains my strongest craft, but I’m comfortable moving
              across the stack and into AI tooling when it helps ship the right
              thing.
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
        <h2 id="principles-heading">A few durable principles.</h2>
        <ol className="principles-grid">
          {principles.map(([title, description]) => (
            <li key={title}>
              <span className="waypoint" aria-hidden="true" />
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section
        className="life-section ruled-section"
        aria-labelledby="outside-heading"
      >
        <div className="life-section-intro">
          <h2 id="outside-heading">
            Endurance, landscapes, and making things.
          </h2>
          <p>
            Running, exploring, and building with my hands keep the rest of life
            connected to the work.
          </p>
        </div>
        <PhotoCarousel items={personalMoments} label="Life beyond work" />
      </section>
    </div>
  )
}
