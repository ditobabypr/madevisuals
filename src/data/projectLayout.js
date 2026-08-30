// Turns a project's slug into a stable, editorial composition: how many
// video/photo slots it gets and in what rhythm. Everything here is a pure
// function of the slug — same input, same output, forever — so the layout
// never shuffles on refresh without needing any persistence.

const MAX_VIDEOS = 4
const MAX_PHOTOS = 8

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

// Four hand-tuned rhythms — each an ordered list of row "beats" — assigned
// to projects deterministically rather than composed from scratch, so every
// project reads as intentional instead of randomly scattered.
const TEMPLATES = [
  ['video-full', 'photo-duo', 'video-wide', 'photo-trio', 'photo-solo'],
  ['photo-solo-large', 'video-full', 'photo-duo', 'video-wide', 'photo-solo'],
  ['video-wide', 'photo-solo', 'photo-duo', 'video-full', 'photo-trio'],
  ['photo-duo', 'video-full', 'photo-solo-large', 'video-wide', 'photo-trio'],
]

const BLOCK_NEEDS = {
  'video-full': { videos: 1, photos: 0 },
  'video-wide': { videos: 1, photos: 0 },
  'photo-solo': { videos: 0, photos: 1 },
  'photo-solo-large': { videos: 0, photos: 1 },
  'photo-duo': { videos: 0, photos: 2 },
  'photo-trio': { videos: 0, photos: 3 },
}

// Given a project, returns { videoCount, photoCount, blocks }. `blocks` is
// an ordered list of { type, videoItems, photoItems } — videoItems/
// photoItems are indexes into project.videos / project.images (real content
// once it exists, otherwise just placeholder slots to render).
export function getProjectComposition(project) {
  const rng = mulberry32(hashString(project.slug))

  const videoCount = Math.min(project.videos.length || randInt(rng, 1, MAX_VIDEOS), MAX_VIDEOS)
  const photoCount = Math.min(project.images.length || randInt(rng, 3, MAX_PHOTOS), MAX_PHOTOS)
  const template = TEMPLATES[randInt(rng, 0, TEMPLATES.length - 1)]

  const blocks = []
  let videosLeft = videoCount
  let photosLeft = photoCount
  let videoIdx = 0
  let photoIdx = 0

  const pushBlock = (type) => {
    const need = BLOCK_NEEDS[type]
    const videoItems = []
    const photoItems = []
    for (let i = 0; i < need.videos; i++) videoItems.push(videoIdx++)
    for (let i = 0; i < need.photos; i++) photoItems.push(photoIdx++)
    blocks.push({ type, videoItems, photoItems })
  }

  for (const type of template) {
    const need = BLOCK_NEEDS[type]
    if (need.videos <= videosLeft && need.photos <= photosLeft) {
      pushBlock(type)
      videosLeft -= need.videos
      photosLeft -= need.photos
    }
  }

  // Whatever the template didn't fit still has to appear somewhere — every
  // video/photo in the count must be placed, none silently dropped.
  while (videosLeft > 0) {
    pushBlock('video-full')
    videosLeft -= 1
  }
  while (photosLeft > 0) {
    const type = photosLeft >= 2 ? 'photo-duo' : 'photo-solo'
    pushBlock(type)
    photosLeft -= BLOCK_NEEDS[type].photos
  }

  return { videoCount, photoCount, blocks }
}
