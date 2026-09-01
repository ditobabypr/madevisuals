import { useState } from 'react'
import Placeholder from './Placeholder'
import YouTubeEmbed, { getYouTubeId } from './YouTubeEmbed'
import './ReelsCarousel.css'

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
)

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

// Shortest signed distance from `index` to `active` around a circle of
// size `count` — e.g. with 3 reels, the item "before" index 0 is index 2
// at offset -1, not +2. This is what makes the loop feel infinite instead
// of snapping back at the ends.
function circularOffset(index, active, count) {
  let diff = index - active
  const half = count / 2
  if (diff > half) diff -= count
  if (diff < -half) diff += count
  return diff
}

export default function ReelsCarousel({ reels = [], label = 'Reel', ratio = '9 / 16', cardWidth }) {
  const [active, setActive] = useState(reels.length > 1 ? 1 : 0)
  const count = reels.length

  if (count === 0) return null

  const goPrev = () => setActive((i) => (i - 1 + count) % count)
  const goNext = () => setActive((i) => (i + 1) % count)

  const [ratioW, ratioH] = ratio.split('/').map((n) => parseFloat(n))

  return (
    <div
      className="reels-carousel"
      style={{ '--ratio-w': ratioW, '--ratio-h': ratioH, ...(cardWidth ? { '--card-w': cardWidth } : {}) }}
    >
      {count > 1 && (
        <button
          type="button"
          className="reels-carousel__arrow reels-carousel__arrow--prev"
          onClick={goPrev}
          aria-label="Reel anterior"
        >
          <ArrowLeftIcon />
        </button>
      )}

      <div className="reels-carousel__stage">
        {reels.map((url, i) => {
          const rawOffset = circularOffset(i, active, count)
          const offset = Math.max(-2, Math.min(2, rawOffset))
          const isCenter = offset === 0
          const isVisible = Math.abs(offset) <= 1
          const scale = isCenter ? 1 : Math.abs(offset) === 1 ? 0.74 : 0.6
          const opacity = isCenter ? 1 : Math.abs(offset) === 1 ? 0.4 : 0
          const brightness = isCenter ? 1 : 0.45
          const thumbId = getYouTubeId(url)

          return (
            <div
              key={i}
              className={`reels-carousel__slot ${isCenter ? 'reels-carousel__slot--center' : ''}`}
              style={{
                transform: `translate(-50%, -50%) translateX(${offset * 108}%) scale(${scale})`,
                opacity,
                filter: `brightness(${brightness})`,
                zIndex: isCenter ? 3 : 2 - Math.abs(offset),
                pointerEvents: isCenter ? 'auto' : 'none',
              }}
              aria-hidden={!isCenter}
            >
              {isCenter ? (
                <YouTubeEmbed
                  url={url}
                  title={`${label} — ${i + 1}`}
                  ratio={ratio}
                  className="reels-carousel__media"
                />
              ) : isVisible && thumbId ? (
                <img
                  src={`https://i.ytimg.com/vi/${thumbId}/hqdefault.jpg`}
                  alt=""
                  loading="lazy"
                  className="reels-carousel__media reels-carousel__thumb"
                />
              ) : (
                <Placeholder ratio={ratio} type="video" label="" className="reels-carousel__media" />
              )}
            </div>
          )
        })}
      </div>

      {count > 1 && (
        <button
          type="button"
          className="reels-carousel__arrow reels-carousel__arrow--next"
          onClick={goNext}
          aria-label="Reel siguiente"
        >
          <ArrowRightIcon />
        </button>
      )}
    </div>
  )
}
