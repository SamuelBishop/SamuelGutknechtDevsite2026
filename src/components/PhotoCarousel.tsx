import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useState, type KeyboardEvent } from 'react'

export type PhotoStoryItem = {
  src: string
  alt: string
  title: string
  description: string
  objectPosition?: string
  fit?: 'cover' | 'contain'
}

type PhotoCarouselProps = {
  items: readonly [PhotoStoryItem, ...PhotoStoryItem[]]
  label: string
}

export function PhotoCarousel({ items, label }: PhotoCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeItem = items[activeIndex]

  function move(direction: -1 | 1) {
    setActiveIndex(
      (current) => (current + direction + items.length) % items.length,
    )
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
      className="photo-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <figure className="photo-carousel-slide">
        <div
          className="photo-carousel-frame"
          data-fit={activeItem.fit ?? 'cover'}
        >
          <img
            key={activeItem.src}
            src={activeItem.src}
            alt={activeItem.alt}
            style={{ objectPosition: activeItem.objectPosition }}
          />
        </div>
        <figcaption className="photo-carousel-caption">
          <div aria-live="polite" aria-atomic="true">
            <h3>{activeItem.title}</h3>
            <p>{activeItem.description}</p>
          </div>
          <div className="photo-carousel-controls">
            <button
              type="button"
              aria-label="Show previous photo"
              onClick={() => move(-1)}
            >
              <ArrowLeft aria-hidden="true" size={18} />
            </button>
            <button
              type="button"
              aria-label="Show next photo"
              onClick={() => move(1)}
            >
              <ArrowRight aria-hidden="true" size={18} />
            </button>
          </div>
        </figcaption>
      </figure>
    </div>
  )
}
