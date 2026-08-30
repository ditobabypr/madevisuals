import { slugify } from '../utils/slugify'

// Same titles as Work and the Home filmstrip. This is the single place that
// will hold each project's real content later — a YouTube URL per entry in
// `videos`, an image path/URL per entry in `images`. Everything about HOW
// that content gets laid out (counts, rhythm, block sizes) lives separately
// in `projectLayout.js`, so filling this in later never means touching page
// markup or layout logic.
const TITLES = [
  'Tinglao Club',
  'Lifepro',
  'Sumoon Fest',
  'La Pizarra de Andrés',
  'Xcape',
  'Karting del Sol',
  'Dubs Burger',
  'Sabika',
  'Corona Extra',
  'Bossa Bora',
  'Santa Rita',
  'Nvoga',
  'Boda',
]

export const PROJECTS = TITLES.map((title) => ({
  slug: slugify(title),
  title,
  // Real content goes here later: e.g. videos: ['https://youtube.com/watch?v=XXXX']
  videos: [],
  images: [],
}))

export function getProjectBySlug(slug) {
  return PROJECTS.find((p) => p.slug === slug) || null
}
