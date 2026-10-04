// Resized WebP copies built by scripts/optimize-images.py, mirroring each
// original's path with a -<width>w suffix. Lets every <img> offer a srcset
// so a phone downloads a ~640px file instead of the camera original. A photo
// with no copies yet (e.g. one just dropped into a folder) simply keeps
// using its original file — re-run the script to generate them.
const stripExt = (path) => path.replace(/\.[^./]+$/, '')

const srcSetByKey = {}

// Only the copies of public/ posters and page photos are listed here (they
// appear on Home); src/data/projects.js registers the project photos' own
// copies, so that list ships with the project pages instead.
export function addVariants(glob) {
  const added = new Set()
  for (const [path, url] of Object.entries(glob)) {
    const match = path.match(/^\/src\/assets\/_optimized\/(.+)-(\d+)w\.webp$/)
    if (!match) continue
    ;(srcSetByKey[match[1]] ||= []).push([Number(match[2]), url])
    added.add(match[1])
  }
  for (const key of added) {
    srcSetByKey[key] = srcSetByKey[key]
      .sort((a, b) => a[0] - b[0])
      .map(([w, url]) => `${url} ${w}w`)
      .join(', ')
  }
}

addVariants(import.meta.glob('/src/assets/_optimized/public/**/*.webp', { eager: true, import: 'default' }))

// Bundled photos come out of import.meta.glob as hashed URLs, which no
// longer say which file they were — remember it so it can be looked up.
const keyByUrl = new Map()

export function trackImages(glob) {
  for (const [path, url] of Object.entries(glob)) {
    keyByUrl.set(url, stripExt(path.replace(/^\/src\/assets\//, '')))
  }
  return glob
}

function getSrcSet(url) {
  if (!url) return undefined
  // Files in public/ keep their plain path (/projects/x.png).
  const key = keyByUrl.get(url) ?? (url.startsWith('/') ? `public${stripExt(url)}` : null)
  return key ? srcSetByKey[key] : undefined
}

// Spread onto an <img>: `<img {...responsiveImage(url, '50vw')} alt="" />`.
// `sizes` is roughly how wide the image renders — the browser uses it to
// pick the smallest file that still looks sharp on that screen.
export function responsiveImage(url, sizes) {
  const srcSet = getSrcSet(url)
  return srcSet ? { srcSet, sizes, src: url } : { src: url }
}
