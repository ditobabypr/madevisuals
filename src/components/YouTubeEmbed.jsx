import Placeholder from './Placeholder'
import './YouTubeEmbed.css'

// Accepts the common YouTube URL shapes (watch, youtu.be, shorts, embed) or
// a bare 11-char video id, and returns just the id. Anything it can't parse
// returns null so the caller can fall back to a placeholder instead of
// breaking the page.
const VALID_ID = /^[\w-]{11}$/

export function getYouTubeId(url) {
  if (!url) return null

  let id = null
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') {
      id = u.pathname.slice(1).split('/')[0] || null
    } else if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
      if (u.pathname.startsWith('/shorts/')) id = u.pathname.split('/')[2] || null
      else if (u.pathname.startsWith('/embed/')) id = u.pathname.split('/')[2] || null
      else id = u.searchParams.get('v')
    }
  } catch {
    // Not a parseable absolute URL — maybe it's already a bare video id.
    id = url
  }

  // Real YouTube ids are always exactly 11 chars — this also quietly
  // rejects placeholder strings (e.g. "PLACEHOLDER_REEL_01") so they
  // fall back to the placeholder UI instead of a broken embed.
  return id && VALID_ID.test(id) ? id : null
}

export default function YouTubeEmbed({ url, title = 'Video', ratio = '16 / 9', className = '' }) {
  const id = getYouTubeId(url)

  if (!id) {
    return (
      <Placeholder
        label="[ YOUTUBE VIDEO ]"
        ratio={ratio}
        type="video"
        className={`youtube-embed youtube-embed--placeholder ${className}`.trim()}
      />
    )
  }

  return (
    <div className={`youtube-embed ${className}`.trim()} style={{ aspectRatio: ratio }}>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        frameBorder="0"
      />
    </div>
  )
}
