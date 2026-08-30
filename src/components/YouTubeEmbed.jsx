import Placeholder from './Placeholder'
import './YouTubeEmbed.css'

// Accepts the common YouTube URL shapes (watch, youtu.be, shorts, embed) or
// a bare 11-char video id, and returns just the id. Anything it can't parse
// returns null so the caller can fall back to a placeholder instead of
// breaking the page.
export function getYouTubeId(url) {
  if (!url) return null

  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') {
      return u.pathname.slice(1).split('/')[0] || null
    }

    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
      if (u.pathname.startsWith('/shorts/')) return u.pathname.split('/')[2] || null
      if (u.pathname.startsWith('/embed/')) return u.pathname.split('/')[2] || null
      return u.searchParams.get('v')
    }

    return null
  } catch {
    // Not a parseable absolute URL — maybe it's already a bare video id.
    return /^[\w-]{11}$/.test(url) ? url : null
  }
}

export default function YouTubeEmbed({ url, title = 'Video', className = '' }) {
  const id = getYouTubeId(url)

  if (!id) {
    return (
      <Placeholder
        label="[ YOUTUBE VIDEO ]"
        ratio="16 / 9"
        type="video"
        className={`youtube-embed youtube-embed--placeholder ${className}`.trim()}
      />
    )
  }

  return (
    <div className={`youtube-embed ${className}`.trim()}>
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
