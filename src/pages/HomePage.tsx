import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ConsistencyBand } from '../components/ConsistencyBand'
import { ContactCallout } from '../components/ContactCallout'
import { SocialLinks } from '../components/SocialLinks'
import { WorkCarousel, type CarouselSlide } from '../components/WorkCarousel'
import { projectItems, workItems } from '../content/siteContent'

// Professional work leads the carousel, then personal projects fill in after.
const selectedSlides: CarouselSlide[] = [
  ...workItems.map((item) => ({
    item,
    to: '/work',
    cta: 'View in Professional Work',
  })),
  ...projectItems.map((item) => ({
    item,
    to: '/projects',
    cta: 'View in Personal Projects',
  })),
]

export function HomePage() {
  return (
    <>
      <section className="hero section-shell" data-trail-scene="1">
        <div className="hero-text">
          <p className="eyebrow">
            Makes Things · Runs Stupid Distances · Rarely Sits Still
          </p>
          <h1>“Someone should build this.” So I usually do.</h1>
          <p className="hero-copy">
            I’m Sam, a software engineer with 5+ years of experience. I have a
            hard time leaving questions unanswered, so most of my free time
            turns into projects, rabbit holes, and learning how things work.
          </p>
          <div className="hero-actions">
            <Link className="text-link" to="/projects">
              See what I’m building <ArrowRight aria-hidden="true" size={17} />
            </Link>
            <Link className="quiet-link" to="/about">
              Learn more about me
            </Link>
          </div>
        </div>
        <div className="hero-aside">
          <figure className="hero-portrait">
            <img
              src="/photos/microsoft-campus.jpg"
              alt="Samuel visiting the Microsoft campus"
              fetchPriority="high"
            />
          </figure>
          <SocialLinks className="hero-social" />
        </div>
      </section>

      <ConsistencyBand />

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
        <WorkCarousel slides={selectedSlides} label="Selected work" />
      </section>

      <section className="personal-band" data-trail-scene="2">
        <div className="section-shell personal-feature">
          <div className="personal-copy">
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
          <figure className="personal-photo">
            <img
              src="/photos/sunflower-trail-race.jpg"
              alt="Samuel trail running through a field of sunflowers"
              loading="lazy"
            />
          </figure>
        </div>
      </section>

      <div className="section-shell callout-wrap" data-trail-scene="5">
        <ContactCallout />
      </div>
    </>
  )
}
