import { ArrowRight, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ContactCallout } from '../components/ContactCallout'
import { WorkCard } from '../components/WorkCard'
import { workItems } from '../content/siteContent'

export function HomePage() {
  return (
    <>
      <section className="hero section-shell" data-trail-scene="1">
        <div className="hero-text">
          <p className="eyebrow">Senior software engineer · Microsoft</p>
          <h1>
            Building software consistently to solve real problems, including my
            own.
          </h1>
          <p className="hero-copy">
            I’m Samuel, a senior software engineer at Microsoft. Front-end and
            product engineering are my home base: React, TypeScript, and complex
            enterprise interfaces. I also work across data, cloud, and AI
            systems when the work calls for it.
          </p>
          <div className="hero-actions">
            <Link className="text-link" to="/work">
              View selected work <ArrowRight aria-hidden="true" size={17} />
            </Link>
            <Link className="quiet-link" to="/about">
              Learn more about me
            </Link>
          </div>
        </div>
        <figure className="hero-portrait media-placeholder portrait">
          <User size={30} aria-hidden="true" />
          <figcaption className="media-label">Portrait photo</figcaption>
        </figure>
      </section>

      <section
        className="current-focus section-shell ruled-section"
        aria-labelledby="focus-heading"
        data-trail-scene="3"
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
        data-trail-scene="4"
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

      <section className="personal-band" data-trail-scene="2">
        <div className="section-shell personal-copy">
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
      </section>

      <div className="section-shell callout-wrap" data-trail-scene="5">
        <ContactCallout />
      </div>
    </>
  )
}
