import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useState, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import type { WorkItem } from '../content/siteContent'

// A carousel slide pairs a work/project item with the page it links to and the
// call-to-action shown on its slide.
export type CarouselSlide = {
  item: WorkItem
  to: string
  cta: string
}

type WorkCarouselProps = {
  slides: readonly CarouselSlide[]
  label: string
}

type SlideImage = {
  src: string
  alt: string
  objectPosition?: string
  fit?: 'cover' | 'contain'
}

// A work item's still image, falling back to its video poster.
function slideImage(item: WorkItem): SlideImage | null {
  if (item.image) {
    return {
      src: item.image.src,
      alt: item.image.alt,
      objectPosition: item.image.objectPosition,
      fit: item.image.fit,
    }
  }
  if (item.video) {
    return { src: item.video.poster, alt: item.video.title }
  }
  return null
}

export function WorkCarousel({ slides, label }: WorkCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (slides.length === 0) return null

  const count = slides.length
  const activeSlide = slides[activeIndex]
  const activeItem = activeSlide.item
  const image = slideImage(activeItem)

  function move(direction: -1 | 1) {
    setActiveIndex((current) => (current + direction + count) % count)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      move(-1)
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      move(1)
    }
  }

  return (
    <div
      className="work-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <Link
        className="work-carousel-slide"
        to={activeSlide.to}
        aria-label={`${activeItem.title} — ${activeSlide.cta}`}
      >
        <div className="work-carousel-frame" data-fit={image?.fit ?? 'cover'}>
          {image ? (
            <img
              key={image.src}
              src={image.src}
              alt={image.alt}
              loading="lazy"
              style={
                image.objectPosition
                  ? { objectPosition: image.objectPosition }
                  : undefined
              }
            />
          ) : null}
        </div>
        <div
          className="work-carousel-caption"
          aria-live="polite"
          aria-atomic="true"
        >
          <p className="work-carousel-kind">{activeItem.kind}</p>
          <h3>{activeItem.title}</h3>
          <p className="work-carousel-summary">{activeItem.context}</p>
          <span className="work-carousel-cue">
            {activeSlide.cta} <ArrowRight aria-hidden="true" size={16} />
          </span>
        </div>
      </Link>

      {count > 1 ? (
        <div className="work-carousel-footer">
          <div className="work-carousel-dots">
            {slides.map((slide, index) => (
              <button
                key={slide.item.title}
                type="button"
                className="work-carousel-dot"
                data-active={index === activeIndex}
                aria-label={`Show ${slide.item.title}`}
                aria-current={index === activeIndex}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
          <div className="work-carousel-controls">
            <button
              type="button"
              aria-label="Show previous work"
              onClick={() => move(-1)}
            >
              <ArrowLeft aria-hidden="true" size={18} />
            </button>
            <button
              type="button"
              aria-label="Show next work"
              onClick={() => move(1)}
            >
              <ArrowRight aria-hidden="true" size={18} />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
