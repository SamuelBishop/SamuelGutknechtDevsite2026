import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ContactCallout } from '../components/ContactCallout'
import { WorkCard } from '../components/WorkCard'
import { workItems } from '../content/siteContent'

export function HomePage() {
  return (
    <>
      <section className="hero section-shell">
        <p className="eyebrow">Senior software engineer · Microsoft</p>
        <h1>
          Building software consistently—to solve my own problems, and hopefully
          yours too.
        </h1>
        <p className="hero-copy">
          I’m Samuel, a senior software engineer at Microsoft. Front-end and
          product engineering are my home base—React, TypeScript, and complex
          enterprise interfaces—and I’m increasingly an action-oriented
          generalist as day-to-day development becomes AI-first.
        </p>
        <div className="hero-actions">
          <Link className="text-link" to="/work">
            View selected work <ArrowRight aria-hidden="true" size={17} />
          </Link>
          <Link className="quiet-link" to="/about">
            Learn more about me
          </Link>
        </div>
      </section>

      <section
        className="current-focus section-shell ruled-section"
        aria-labelledby="focus-heading"
      >
        <p className="eyebrow">Current focus</p>
        <div className="split-copy">
          <h2 id="focus-heading">
            Where product judgment meets technical depth.
          </h2>
          <p>
            I enjoy the part of engineering where product judgment and technical
            depth meet: shaping an interaction, finding the right abstraction,
            and making sure the experience holds up in real-world use.
          </p>
        </div>
      </section>

      <section
        className="section-shell ruled-section"
        aria-labelledby="selected-work-heading"
      >
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2 id="selected-work-heading">
              A few areas I’ve been working in.
            </h2>
          </div>
          <Link className="text-link" to="/work">
            See all work <ArrowRight aria-hidden="true" size={17} />
          </Link>
        </div>
        <div className="work-list compact">
          {workItems.slice(0, 2).map((item, index) => (
            <WorkCard key={item.title} item={item} index={index} />
          ))}
        </div>
      </section>

      <section className="personal-band">
        <div className="section-shell personal-grid">
          <div className="landscape-mark" aria-hidden="true">
            <span className="sun" />
            <svg viewBox="0 0 480 240" role="presentation">
              <path d="M-20 208 106 86l68 68 53-53 121 112 73-80 79 74" />
              <path d="M-20 226 132 143l62 44 77-34 84 66 58-48 87 55" />
            </svg>
          </div>
          <div>
            <p className="eyebrow">Away from the screen</p>
            <h2>Usually headed toward higher ground.</h2>
            <p>
              I’m usually drawn toward trails, mountains, skiing, or a
              camper/Tacoma project. Home is life with my wife and dog—and an
              ever-changing list of side projects.
            </p>
            <Link className="text-link" to="/about">
              More about life outside work{' '}
              <ArrowRight aria-hidden="true" size={17} />
            </Link>
          </div>
        </div>
      </section>

      <div className="section-shell callout-wrap">
        <ContactCallout />
      </div>
    </>
  )
}
