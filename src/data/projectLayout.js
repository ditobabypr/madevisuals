// Turns a project's slug into a stable placeholder video count. Pure
// function of the slug — same input, same output, forever — so the count
// never shuffles on refresh without needing any persistence.

const MAX_VIDEOS = 4

// FNV-1a — small, dependency-free, good enough spread for this.
function hashString(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// mulberry32 — deterministic PRNG seeded from the hash above.
function mulberry32(seed) {
  let t = seed
  return function next() {
    t = (t + 0x6d2b79f5) | 0
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

function randInt(rng, min, max) {
  return min + Math.floor(rng() * (max - min + 1))
}

// How many video slots a project's vertical "reels" strip gets — real
// videos.length wins once content exists, otherwise a stable 1-4 guess.
export function getVideoCount(project) {
  const rng = mulberry32(hashString(project.slug))
  return Math.min(project.videos.length || randInt(rng, 1, MAX_VIDEOS), MAX_VIDEOS)
}
