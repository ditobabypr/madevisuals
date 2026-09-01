import { slugify } from '../utils/slugify'

// Xcape's three collage folders — drop photos straight into
// src/assets/xcape/<mallorca|mexico|royal-week>/ (any filename, any of
// these extensions) and Vite picks them up automatically, in dev and in
// the built site, no code changes needed. Sorted by filename so upload
// order is predictable; prefix with numbers (01_, 02_...) to control it.
// import.meta.glob needs a literal string pattern (no variables/template
// interpolation), so each folder gets its own explicit call.
const mallorcaPhotos = import.meta.glob('/src/assets/xcape/mallorca/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', { eager: true, import: 'default' })
const mexicoPhotos = import.meta.glob('/src/assets/xcape/mexico/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', { eager: true, import: 'default' })
const royalWeekPhotos = import.meta.glob('/src/assets/xcape/royal-week/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', { eager: true, import: 'default' })

function toImages(photoGlob) {
  return Object.keys(photoGlob).sort().map((path) => photoGlob[path])
}

// Always returns exactly `count` collage slots — real photos first
// (sorted by filename), padded with empty placeholders while fewer
// than `count` exist yet.
function toCollage(photoGlob, count = 10) {
  const items = toImages(photoGlob).slice(0, count).map((url) => ({ url }))
  while (items.length < count) items.push({ url: '' })
  return items
}

// Same mechanism, one folder per event — drop photos into
// src/assets/projects/<slug>/ (any filename, jpg/jpeg/png/webp) and they
// appear on that project's page automatically, no code changes needed.
const sumoonFestPhotos = toImages(import.meta.glob('/src/assets/sumwoon/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', { eager: true, import: 'default' }))
// Separate folder just for Sumoon Fest's single "project image" (intro)
// photo — kept apart from src/assets/sumwoon/ so the 6-photo row and the
// intro photo never fight over the same pictures.
const sumoonCoverPhotos = toImages(import.meta.glob('/src/assets/sumoon-cover/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', { eager: true, import: 'default' }))
const laPizarraPhotos = import.meta.glob('/src/assets/la pizarra de andres/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', { eager: true, import: 'default' })
const kartingDelSolPhotos = toImages(import.meta.glob('/src/assets/karts/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', { eager: true, import: 'default' }))
const dubsBurgerPhotos = toImages(import.meta.glob('/src/assets/dubs/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', { eager: true, import: 'default' }))
const sabikaPhotos = toImages(import.meta.glob('/src/assets/sabika/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', { eager: true, import: 'default' }))
const coronaExtraPhotos = toImages(import.meta.glob('/src/assets/corona/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', { eager: true, import: 'default' }))
const bossaBoraPhotos = toImages(import.meta.glob('/src/assets/bossa bora/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', { eager: true, import: 'default' }))
const santaRitaPhotos = toImages(import.meta.glob('/src/assets/santa rita/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', { eager: true, import: 'default' }))
const nvogaPhotos = toImages(import.meta.glob('/src/assets/nvoga/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', { eager: true, import: 'default' }))
const bodaPhotos = toImages(import.meta.glob('/src/assets/boda/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', { eager: true, import: 'default' }))
// Separate folder just for Boda's single "project image" (intro) photo —
// kept apart from src/assets/boda/ so the collage and the intro photo
// never fight over the same pictures.
const bodaCoverPhotos = toImages(import.meta.glob('/src/assets/boda-cover/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', { eager: true, import: 'default' }))

// Same titles, poster/logo art and format as Work and the Home filmstrip —
// the banner at the top of each detail page reuses the exact same cover
// image and logo already shown on the Work tile. This is the single place
// that holds each project's real content — a YouTube URL per entry in
// `videos` (first one is the main video), an image path/URL per entry in
// `images`. Filling those in later never means touching page markup.
const SEEDS = [
  {
    title: 'Tinglao Club',
    format: 'horizontal',
    poster: 'https://res.cloudinary.com/xawdx2ki/image/upload/v1787932073/tinglao-club-poster.png',
    logo: 'https://res.cloudinary.com/xawdx2ki/image/upload/v1787932072/tinglao-club-logo.png',
    videos: ['https://www.youtube.com/watch?v=yx35bDAit3k'],
    reels: ['https://www.youtube.com/shorts/yRKAnT_DrBg', 'https://www.youtube.com/shorts/TZuoSN3-ERM', 'https://www.youtube.com/shorts/lii5LnnPQkg', 'https://www.youtube.com/shorts/Tc2GGw886C0'],
    images: ['/projects/tinglao-club-photo.jpg'],
    text: 'Una serie de aftermovies que recoge la esencia de las noches de Tinglao Club. Un proyecto audiovisual desarrollado de principio a fin, combinando producción, grabación y edición para construir piezas dinámicas y cuidadas que trasladan la experiencia más allá de la pista.',
  },
  {
    title: 'Lifepro',
    format: 'vertical',
    poster: '/projects/laura-marc-poster.png',
    logo: 'https://res.cloudinary.com/xawdx2ki/image/upload/f_auto,q_auto/v1788020795/100.png',
    noReels: true,
    introMedia: 'video',
    images: ['https://www.youtube.com/shorts/BpUH4fvzUWs'],
  },
  {
    title: 'Sumoon Fest',
    text: 'Summon Fest plantea un reto diferente: condensar la dimensión de un festival multitudinario en piezas breves, directas y visualmente atractivas. Celebrado en Mallorca, el festival reúne a cientos de estudiantes en torno a la música y al ambiente propio de una gran celebración. Una cobertura construida desde una mirada cercana al público, a lo que sucede alrededor del escenario, buscando momentos espontáneos, interacción y situaciones que permitan entender la magnitud del evento sin necesidad de explicarlo. En Summon, el enfoque se centra en condensar la escala del evento en una narrativa visual cercana y dinámica, encontrando entre la multitud los momentos, interacciones y situaciones que mejor representan la experiencia.', 
    format: 'vertical',
    poster: '/projects/noche-blanca-poster.png',
    logo: 'https://res.cloudinary.com/xawdx2ki/image/upload/f_auto,q_auto/v1788021875/summonfest.png',
    images: sumoonCoverPhotos,
    noReels: true,
    reelsCarousel: [
      'https://www.youtube.com/shorts/U3aYtepWbm8',
      'https://www.youtube.com/shorts/jc6TzIXi5Dk',
      'https://www.youtube.com/shorts/0J1JT75rjfQ',
    ],
    sideImages: sumoonFestPhotos,
  },
  {
    title: 'La Pizarra de Andrés',
    format: 'horizontal',
    poster: '/projects/andres-poster.png',
    logo: 'https://res.cloudinary.com/xawdx2ki/image/upload/f_auto,q_auto/v1787935764/LAPIZARRA.png',
    videos: ['https://www.youtube.com/watch?v=EyN8Cp6_BjM'],
    photoCollage: toCollage(laPizarraPhotos, 5),
  },
  {
    title: 'Xcape',
    text: 'Tres años, distintos destinos y una misma intención: construir una forma reconocible de contar la experiencia Xcape. En colaboración con MDAProds, el proyecto abarca la dirección creativa de aftermovies, fotografía y reels desarrollados durante cada operativa, desde Royal Week y los viajes a México hasta Xcape Town en Mallorca. Un trabajo continuo en el que cada destino plantea una narrativa diferente, adaptando el lenguaje visual a sus espacios, personas y momentos sin perder una identidad común. El objetivo es ir más allá de documentar cada viaje y convertir cada experiencia en contenido capaz de transmitir su energía, su ambiente y aquello que hace que Xcape sea Xcape.',
    format: 'horizontal',
    poster: '/projects/costa-sur-poster.png',
    logo: 'https://res.cloudinary.com/xawdx2ki/image/upload/f_auto,q_auto/v1788019320/Logo-Xcape-blanco.png',
    images: ['https://res.cloudinary.com/xawdx2ki/image/upload/v1788140136/DSC03799.jpg'],
    sections: [
      {
        label: 'Royal Week',
        video: 'https://www.youtube.com/watch?v=EMMjQMqZLAE',
        collage: toCollage(royalWeekPhotos),
        reels: [
          'https://www.youtube.com/shorts/4oc26Ldq2jA',
          'https://www.youtube.com/shorts/-dYqn-bvr74',
          'https://www.youtube.com/shorts/6tJiBmRh9cQ',
        ],
      },
      {
        label: 'Xcape México',
        video: 'https://www.youtube.com/watch?v=eNQgbeFzPCU',
        collage: toCollage(mexicoPhotos),
        reels: [
          'https://www.youtube.com/shorts/dcbcRvPS62Q',
          'https://www.youtube.com/shorts/keZS8TOmGCg',
          'https://www.youtube.com/shorts/y7Yg3Z17O94',
        ],
      },
      {
        label: 'Xcape Mallorca',
        video: 'https://www.youtube.com/watch?v=Dl5yzDHp5KE',
        collage: toCollage(mallorcaPhotos),
        reels: [
          'https://www.youtube.com/shorts/RVlkoqF5omk',
          'https://www.youtube.com/shorts/Inc0DkJp0I4',
          'https://www.youtube.com/shorts/idj8ErrBRa0',
        ],
      },
    ],
  },
  {
    title: 'Karting del Sol',
    format: 'vertical',
    poster: '/projects/islas-griegas-poster.png',
    logo: null,
    images: kartingDelSolPhotos,
  },
  {
    title: 'Dubs Burger',
    format: 'vertical',
    poster: '/projects/elenajon-poster.png',
    logo: 'https://res.cloudinary.com/xawdx2ki/image/upload/e_trim/f_auto,q_auto/v1788049333/dubs2.png',
    images: dubsBurgerPhotos,
  },
  {
    title: 'Sabika',
    format: 'horizontal',
    poster: '/projects/pacha-rooftop-poster.png',
    logo: '/projects/sabika-logo-2.png',
    videos: ['https://www.youtube.com/watch?v=BcIbj4GheOU'],
    images: sabikaPhotos,
    reelsCarousel: [
      'https://www.youtube.com/shorts/IeAjCoFD4gg',
      'https://www.youtube.com/shorts/eQU0voHe75A',
      'https://www.youtube.com/shorts/G77hjIeJFu8',
    ],
    sideImages: sabikaPhotos.slice(1),
  },
  {
    title: 'Corona Extra',
    format: 'horizontal',
    poster: '/projects/sesion-privada-poster.png',
    logo: 'https://res.cloudinary.com/xawdx2ki/image/upload/f_auto,q_auto/v1788047703/corona-extra-1-logo-png-transparent.png',
    images: coronaExtraPhotos,
  },
  {
    title: 'Bossa Bora',
    text: 'Una línea de contenido audiovisual desarrollada para Bossa Bora, buscando equilibrar una estética cuidada con el ritmo y la espontaneidad propios de una fiesta de verano. La grabación combina planos de ambiente, detalles, personas y momentos clave del evento con una edición dinámica, trabajando el movimiento, la música y el ritmo para construir piezas con una identidad visual definida. Un enfoque pensado para mantener una imagen limpia y sofisticada sin perder la energía natural de una noche de verano en Bossa Playa, Torrox.',
    format: 'vertical',
    poster: '/projects/sunrise-session-poster.png',
    logo: 'https://res.cloudinary.com/xawdx2ki/image/upload/f_auto,q_auto/v1788047612/BossaBora_-_Logo.png',
    images: bossaBoraPhotos,
    noReels: true,
    reelsCarousel: [
      'https://www.youtube.com/shorts/uBIrwriD4XY',
      'https://www.youtube.com/shorts/rWbgzkTF8tI',
      'https://www.youtube.com/shorts/dBiMtXbBTTM',
      'https://www.youtube.com/shorts/hP7qUdyRYwQ',
      'https://www.youtube.com/shorts/YF75E4lom7A',
      'https://www.youtube.com/shorts/XoP_f1iggZs',
    ],
  },
  {
    title: 'Santa Rita',
    format: 'vertical',
    poster: '/projects/marruecos-poster.png',
    logo: 'https://res.cloudinary.com/xawdx2ki/image/upload/e_trim/f_auto,q_auto/v1788022208/Logo-Santa-Rita.png',
    images: santaRitaPhotos,
  },
  {
    title: 'Nvoga',
    format: 'horizontal',
    poster: '/projects/apertura-aurora-poster.png',
    logo: 'https://res.cloudinary.com/xawdx2ki/image/upload/f_auto,q_auto/v1788019488/nvoga_1.png',
    logoBackground: 'rgba(6, 6, 7, 0.82)',
    images: nvogaPhotos,
  },
  {
    title: 'Boda',
    format: 'horizontal',
    videos: ['https://www.youtube.com/watch?v=kXcbQy-i_D8'],
    poster: '/projects/rooftop-vows-poster.png',
    logo: null,
    images: bodaCoverPhotos,
    reelsCarousel: [
      'https://www.youtube.com/watch?v=cR0v8KmsT7U',
      'https://www.youtube.com/watch?v=-9aPnZeAlvE',
      'https://www.youtube.com/shorts/X4iAK4bkhrY',
    ],
    reelsCarouselRatio: '4 / 3',
    reelsCarouselWidth: 'clamp(240px, 30vw, 420px)',
    photoCollage: toCollage(bodaPhotos, 16),
    photoCollageRatio: '2.6 / 1',
    photoCollageShape: 'mosaic',
  },
]

export const PROJECTS = SEEDS.map(({ title, format, poster, logo, logoBackground, videos = [], images = [], reels = [], text = '', sections = [], noReels = false, introMedia = 'photo', photoCollage = [], photoCollageRatio = '2 / 1', photoCollageShape = 'rect', reelsCarousel = [], reelsCarouselRatio = '9 / 16', reelsCarouselWidth = undefined, sideImages = [] }) => ({
  slug: slugify(title),
  title,
  format,
  poster,
  logo,
  logoBackground,
  videos,
  images,
  reels,
  text,
  sections,
  noReels,
  introMedia,
  photoCollage,
  photoCollageRatio,
  photoCollageShape,
  reelsCarousel,
  reelsCarouselRatio,
  reelsCarouselWidth,
  sideImages,
}))

export function getProjectBySlug(slug) {
  return PROJECTS.find((p) => p.slug === slug) || null
}
