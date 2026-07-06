import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ContactCallout } from '../components/ContactCallout'
import { WorkCard } from '../components/WorkCard'
import { workItems } from '../content/siteContent'

export function HomePage() {
  return (
    <>
      <section className="hero section-shell">
        <svg
          className="hero-topo"
          viewBox="0 0 600 600"
          aria-hidden="true"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <path
              id="ridge"
              d="M0,-120 C70,-120 130,-70 130,0 C130,80 60,120 -10,120 C-90,120 -130,60 -130,-20 C-130,-90 -60,-120 0,-120 Z"
            />
          </defs>
          <g className="contours" fill="none" stroke="currentColor">
            <use href="#ridge" transform="translate(360 300) scale(0.45)" />
            <use href="#ridge" transform="translate(360 300) scale(0.85)" />
            <use href="#ridge" transform="translate(360 300) scale(1.25)" />
            <use href="#ridge" transform="translate(360 300) scale(1.65)" />
            <use href="#ridge" transform="translate(360 300) scale(2.05)" />
            <use href="#ridge" transform="translate(360 300) scale(2.45)" />
          </g>
          <path
            className="route"
            d="M30,540 C170,500 210,380 320,352 C420,326 452,236 486,120"
            fill="none"
          />
          <circle className="route-dot" cx="320" cy="352" r="6.5" />
        </svg>
        <p className="eyebrow">Senior software engineer · Microsoft</p>
        <h1>
          Building software consistently to solve real problems, including my
          own.
        </h1>
        <p className="hero-copy">
          I’m Samuel, a senior software engineer at Microsoft. Front-end and
          product engineering are my home base: React, TypeScript, and complex
          enterprise interfaces. I also work across data, cloud, and AI systems
          when the work calls for it.
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
          <h2 id="focus-heading">Product judgment backed by working code.</h2>
          <p>
            I enjoy the part of engineering where product judgment and technical
            depth meet: shaping an interaction, finding the right abstraction,
            and making sure the experience holds up in real use.
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
              camper/Tacoma project. Home is life with my wife and dog, plus an
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
