import type { ReactNode } from 'react'
import { Doodle } from '../components/Doodles'
import { PhotoCarousel, type PhotoStoryItem } from '../components/PhotoCarousel'
import { SectionIntro } from '../components/SectionIntro'
import { SocialLinks } from '../components/SocialLinks'

/** Traced icon in public/icons/ used as the chapter's mask image. */
type ChapterIcon = 'home' | 'movement' | 'coaching' | 'music'

type Chapter = {
  title: string
  description: ReactNode
  icon: ChapterIcon
}

const chapters: Chapter[] = [
  {
    title: 'Home',
    description:
      'My wife Shane and I live in Lakewood, Colorado, with our two dogs, Addie and Daisy.',
    icon: 'home',
  },
  {
    title: 'Movement',
    description: (
      <>
        I’ve spent most of my life in endurance sports.{' '}
        <a
          className="text-link"
          href="https://madwestcc.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Cross country
        </a>{' '}
        came first, then track and field,{' '}
        <a
          className="text-link"
          href="https://www.instagram.com/mizclubtriathlon/"
          target="_blank"
          rel="noopener noreferrer"
        >
          triathlon
        </a>
        , and eventually{' '}
        <a
          className="text-link"
          href="https://ultrasignup.com/m_results_participant.aspx?fname=Samuel&lname=Bishop"
          target="_blank"
          rel="noopener noreferrer"
        >
          trail and mountain running
        </a>
        .
      </>
    ),
    icon: 'movement',
  },
  {
    title: 'Coaching',
    description: (
      <>
        I volunteer as an assistant cross country coach at{' '}
        <a
          className="text-link"
          href="https://sites.google.com/jeffcoschools.us/greenmountainxc/home"
          target="_blank"
          rel="noopener noreferrer"
        >
          Green Mountain High School
        </a>
        . It’s been a fun way to stay connected to a sport that’s given me so
        much, and to become involved in the community that I live in.
      </>
    ),
    icon: 'coaching',
  },
  {
    title: 'Music',
    description: (
      <>
        Music was a big part of my childhood. I spent years playing violin and
        viola in the{' '}
        <a
          className="text-link"
          href="https://wysomusic.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Wisconsin Youth Symphony Orchestra
        </a>
        . Recently, I’ve been trying to learn the piano and building back up the
        habit of practicing again.
      </>
    ),
    icon: 'music',
  },
]

const personalMoments: [PhotoStoryItem, ...PhotoStoryItem[]] = [
  {
    src: '/photos/maroon-bells-run.jpg',
    alt: 'Samuel and his wife Shane in running vests below the Maroon Bells in Colorado',
    title: 'My favorite crew',
    description:
      'Shane and me a few miles into a run below the Maroon Bells. Most of our weekends look roughly like this.',
  },
  {
    src: '/photos/addie-tulip-fields.jpg',
    alt: 'Addie, a black lab, sitting on a path running through rows of tulips',
    title: 'Addie',
    description:
      'Our black lab, completely unbothered by the tulip fields we drove her out to see.',
  },
  {
    src: '/photos/daisy-autumn.jpg',
    alt: 'Daisy, a young silver-brown lab, sitting on a stone patio covered in fallen leaves',
    title: 'Daisy',
    description:
      'The other half of the pack, holding a sit just long enough for one photo.',
  },
  {
    src: '/photos/forest-trail-race.jpg',
    alt: 'Samuel running a forest trail race through mossy trees wearing race bib 652',
    title: 'Race day',
    description:
      'A trail race in the woods outside Seattle. I have been pinning on a number since I was 13 and it still feels the same.',
  },
  {
    src: '/photos/engineering-graduation.jpg',
    alt: 'Samuel outside the University of Missouri engineering laboratories after graduation',
    title: 'Where it started',
    description:
      'Wrapping up at the University of Missouri, still not entirely sure what I wanted to build, just that I wanted to build.',
    objectPosition: '50% 62%',
  },
]

export function AboutPage() {
  return (
    <div className="section-shell page-stack">
      <SectionIntro eyebrow="About" title="Who’s this guy?">
        <p>
          Below you’ll find a little about who I am and what I enjoy doing.
          Lately I’ve been thinking less about collecting accomplishments and
          more about building things that matter, giving back where I can, and
          staying curious.
        </p>
      </SectionIntro>

      <section
        className="prose-section ruled-section"
        aria-labelledby="story-heading"
      >
        <div className="split-copy">
          <div>
            <h2 id="story-heading">Background</h2>
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
              I grew up in a small city just outside Madison, Wisconsin, called{' '}
              <strong className="hl">Fitchburg</strong>, mostly known for its{' '}
              <span className="term">
                <strong className="hl">dairy</strong>
                <Doodle name="cow" />
              </span>{' '}
              and rolling farmland. I was fortunate enough to attend high school
              in the{' '}
              <span className="term">
                <strong className="hl">“big city” of Madison, Wisconsin</strong>
                <Doodle name="capitol" />
              </span>
              , which, to me at the time, felt like the center of the universe.
              It was where I first found teachers, coaches, and friends who
              challenged me to think bigger and showed me there were far more
              possibilities than I’d imagined. Growing up, I spent my time
              outdoors, in Boy Scouts,{' '}
              <span className="term">
                <strong className="hl">youth orchestras</strong>
                <Doodle name="violin" />
              </span>
              , and on cross country and track teams. Many of the things I still
              care most about today can be traced back to those years.
            </p>
            <p>
              College was split between{' '}
              <span className="term">
                <strong className="hl">engineering labs</strong>
                <Doodle name="solder" />
              </span>{' '}
              and long bike rides. I studied electrical and computer engineering
              at the <strong className="hl">University of Missouri</strong>{' '}
              while competing for the{' '}
              <span className="term">
                <strong className="hl">club triathlon team</strong>
                <Doodle name="bike" />
              </span>
              . Along the way, I was fortunate to intern at both{' '}
              <strong className="hl">Garmin and Microsoft</strong>, where I
              discovered I genuinely liked building software and hardware as
              much as I liked learning about it. After university,{' '}
              <span className="term">
                <strong className="hl">Seattle</strong>
                <Doodle name="needle" />
              </span>{' '}
              became home for the next four years as I started my career at
              Microsoft’s headquarters. A few years later, my wife Shane and I
              moved to{' '}
              <span className="term">
                <strong className="hl">Lakewood, Colorado</strong>
                <Doodle name="mountains" />
              </span>
              , trading city life for easier access to trails, mountains, and
              the outdoors we already spent most of our free time chasing.
            </p>
          </div>
        </div>
      </section>
      <section className="ruled-section">
        <div className="about-chapters">
          {chapters.map(({ title, description, icon }) => (
            <article className="about-chapter" key={title}>
              <span
                className="about-chapter-icon"
                data-icon={icon}
                aria-hidden={true}
              />
              <div className="about-chapter-copy">
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        className="life-section ruled-section"
        aria-labelledby="outside-heading"
      >
        <div className="life-section-intro">
          <h2 id="outside-heading">A few snapshots.</h2>
          <p>
            Running, the mountains, tinkering, and the people I share it all
            with.
          </p>
        </div>
        <PhotoCarousel items={personalMoments} label="Life beyond work" />
      </section>
    </div>
  )
}
