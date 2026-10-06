import { slugify } from '../utils/slugify'
import { addVariants, trackImages } from '../utils/responsiveImage'

// Resized copies of every photo below (see scripts/optimize-images.py).
addVariants(import.meta.glob(['/src/assets/_optimized/**/*.webp', '!/src/assets/_optimized/public/**'], { eager: true, import: 'default' }))

// Xcape's three collage folders — drop photos straight into
// src/assets/xcape/<mallorca|mexico|royal-week>/ (any filename, any of
// these extensions) and Vite picks them up automatically, in dev and in
// the built site, no code changes needed. Sorted by filename so upload
// order is predictable; prefix with numbers (01_, 02_...) to control it.
// import.meta.glob needs a literal string pattern (no variables/template
// interpolation), so each folder gets its own explicit call.
const mallorcaPhotos = trackImages(import.meta.glob('/src/assets/xcape/mallorca/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', { eager: true, import: 'default' }))
const mexicoPhotos = trackImages(import.meta.glob('/src/assets/xcape/mexico/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', { eager: true, import: 'default' }))
const royalWeekPhotos = trackImages(import.meta.glob('/src/assets/xcape/royal-week/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', { eager: true, import: 'default' }))

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
const sumoonFestPhotos = toImages(trackImages(import.meta.glob('/src/assets/sumwoon/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', { eager: true, import: 'default' })))
// Separate folder just for Sumoon Fest's single "project image" (intro)
// photo — kept apart from src/assets/sumwoon/ so the 6-photo row and the
// intro photo never fight over the same pictures.
const sumoonCoverPhotos = toImages(trackImages(import.meta.glob('/src/assets/sumoon-cover/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', { eager: true, import: 'default' })))
const laPizarraPhotos = trackImages(import.meta.glob('/src/assets/la pizarra de andres/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', { eager: true, import: 'default' }))
// Sorted [1.jpg, 2.jpg, 33.jpg, 4.jpg, 5.jpg, 6.jpg] — indexed below to pick
// specific photos for the project image vs. the collage.
const laPizarraSorted = toImages(laPizarraPhotos)
const sabikaPhotos = toImages(trackImages(import.meta.glob('/src/assets/sabika/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', { eager: true, import: 'default' })))
const bossaBoraPhotos = toImages(trackImages(import.meta.glob('/src/assets/bossa bora/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', { eager: true, import: 'default' })))
const nvogaPhotos = toImages(trackImages(import.meta.glob('/src/assets/nvoga/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', { eager: true, import: 'default' })))
const bodaPhotos = toImages(trackImages(import.meta.glob('/src/assets/boda/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', { eager: true, import: 'default' })))
// Separate folder just for Boda's single "project image" (intro) photo —
// kept apart from src/assets/boda/ so the collage and the intro photo
// never fight over the same pictures.
const bodaCoverPhotos = toImages(trackImages(import.meta.glob('/src/assets/boda-cover/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', { eager: true, import: 'default' })))

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
    poster: '/projects/tinglao-club-poster.png',
    logo: '/logos/tinglao-club.png',
    videos: ['https://www.youtube.com/watch?v=yx35bDAit3k'],
    reels: ['https://www.youtube.com/shorts/yRKAnT_DrBg', 'https://www.youtube.com/shorts/TZuoSN3-ERM', 'https://www.youtube.com/shorts/lii5LnnPQkg', 'https://www.youtube.com/shorts/Tc2GGw886C0'],
    images: ['/projects/tinglao-club-photo.jpg'],
    text: 'Una serie de aftermovies que recoge la esencia de las noches de Tinglao Club. Un proyecto audiovisual desarrollado de principio a fin, combinando producción, grabación y edición para construir piezas dinámicas y cuidadas que trasladan la experiencia más allá de la pista.',
  },
  {
    title: 'Lifepro',
    text: 'Con motivo del lanzamiento de su nueva colección de ropa, Life Pro reunió en un mismo espacio producto, deporte y lifestyle en una jornada recogida en un reel dinámico con una narrativa visual limpia y contemporánea para presentar la colección desde dentro, poniendo el foco en las prendas, las personas y la atmósfera que acompañó a este nuevo capítulo de Life Pro.',
    format: 'vertical',
    poster: '/projects/laura-marc-poster.png',
    logo: '/logos/lifepro.png',
    noReels: true,
    introMedia: 'video',
    images: ['https://www.youtube.com/shorts/BpUH4fvzUWs'],
  },
  {
    title: 'Sumoon Fest',
    text: 'Summon Fest plantea un reto diferente: condensar la dimensión de un festival multitudinario en piezas breves, directas y visualmente atractivas. Celebrado en Mallorca, el festival reúne a cientos de estudiantes en torno a la música y al ambiente propio de una gran celebración. Una cobertura construida desde una mirada cercana al público, a lo que sucede alrededor del escenario, buscando momentos espontáneos, interacción y situaciones que permitan entender la magnitud del evento sin necesidad de explicarlo. En Summon, el enfoque se centra en condensar la escala del evento en una narrativa visual cercana y dinámica, encontrando entre la multitud los momentos, interacciones y situaciones que mejor representan la experiencia.', 
    format: 'vertical',
    poster: '/projects/noche-blanca-poster.png',
    logo: '/logos/sumoon-fest.png',
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
    text: 'La Pizarra de Andrés reúne en un mismo espacio análisis, inversión y conversación con algunas de las voces más relevantes del sector. En colaboración con mdaprods, la cobertura del evento combina fotografía, vídeo y entrevistas a los distintos ponentes, construyendo un registro visual que recoge tanto el contenido como la atmósfera de la jornada. Una narrativa centrada en las personas, las ideas y los momentos que dieron forma al encuentro, trasladando la experiencia más allá del propio espacio a través de piezas pensadas para su comunicación posterior.',
    format: 'horizontal',
    poster: '/projects/andres-poster.png',
    logo: '/logos/la-pizarra-de-andres.png',
    videos: ['https://www.youtube.com/watch?v=EyN8Cp6_BjM'],
    images: [laPizarraSorted[2]], // 33.jpg
    photoCollage: [
      { url: laPizarraSorted[0] }, // 1.jpg
      { url: laPizarraSorted[1] }, // 2.jpg
      { url: laPizarraSorted[0] }, // 1.jpg — replaces 33.jpg's old slot
      { url: laPizarraSorted[3] }, // 4.jpg
      { url: laPizarraSorted[4] }, // 5.jpg
    ],
  },
  {
    title: 'Xcape',
    text: 'Tres años, distintos destinos y una misma intención: construir una forma reconocible de contar la experiencia Xcape. En colaboración con MDAProds, el proyecto abarca la dirección creativa de aftermovies, fotografía y reels desarrollados durante cada operativa, desde Royal Week y los viajes a México hasta Xcape Town en Mallorca. Un trabajo continuo en el que cada destino plantea una narrativa diferente, adaptando el lenguaje visual a sus espacios, personas y momentos sin perder una identidad común. El objetivo es ir más allá de documentar cada viaje y convertir cada experiencia en contenido capaz de transmitir su energía, su ambiente y aquello que hace que Xcape sea Xcape.',
    format: 'horizontal',
    poster: '/projects/costa-sur-poster.png',
    logo: '/logos/xcape.png',
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
    text: 'Una jornada de karting junto a Pablo Jaime, piloto de F4, planteada como una pieza personal alrededor de la velocidad, el movimiento y la competición.\n\nLa producción combina reel y fotografía para recoger diferentes momentos del día, desde la intensidad de la pista hasta los detalles que acompañan la experiencia. Una narrativa visual dinámica y directa, construida desde el ritmo de la conducción y la energía propia del entorno.',
    format: 'vertical',
    poster: '/projects/islas-griegas-poster.png',
    images: ['https://www.youtube.com/shorts/fRBA54jWDcM'],
    logo: null,
    introMedia: 'video',
    noReels: true,
  },
  {
    title: 'Dubs Burger',
    text: 'Dubs Burger plantea un reto de comunicación integral para una marca gastronómica con una identidad muy marcada: trasladar su esencia más allá del propio local y mantenerla viva en el día a día de sus redes sociales.\nUn proyecto que combina reels, fotografía de producto y ambiente junto con el diseño gráfico para construir una línea visual reconocible y coherente en cada pieza. El resultado es una comunicación dinámica y directa, pensada para funcionar en redes sin perder la personalidad de la marca ni la calidad de cada contenido.',
    format: 'vertical',
    poster: '/projects/elenajon-poster.png',
    logo: '/logos/dubs-burger.png',
    noReels: true,
    noIntroImage: true,
    reelsCarousel: ['https://www.youtube.com/shorts/x6XTDlD5LAg', 'https://www.youtube.com/shorts/-YAXm3y6_t0', 'https://www.youtube.com/shorts/8sXH8UQyaR0'],
  },
  {
    title: 'Sabika',
    format: 'horizontal',
    poster: '/projects/pacha-rooftop-poster.png',
    logo: '/projects/sabika-logo-2.png',
    text: 'Una propuesta de contenido construida alrededor de cada nueva colección, buscando una imagen sólida y coherente en todos sus lanzamientos. \n\nSesiones de fotografía, lanzamientos y piezas audiovisuales, desarrolladas específicamente para presentar cada colección y trabajar tanto el producto como el contexto que lo acompaña.',
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
    logo: '/logos/corona-extra.png',
    noIntroImage: true,
    videos: ['https://www.youtube.com/watch?v=1aDpuOJb6k4'],
    text: 'Cobertura que combina fotografía y contenido audiovisual para recoger tanto los momentos principales del evento como aquellos detalles que construyen la experiencia alrededor de la marca en este evento junto al mar. Una narrativa visual natural y luminosa, pensada para mostrar el evento desde una perspectiva cercana y aspiracional.\n\nUn proyecto donde producto, espacio y ambiente se integran bajo una misma dirección visual, convirtiendo la experiencia en una pieza de comunicación de marca.',
  },
  {
    title: 'Bossa Bora',
    text: 'Una línea de contenido audiovisual desarrollada para Bossa Bora, buscando equilibrar una estética cuidada con el ritmo y la espontaneidad propios de una fiesta de verano. La grabación combina planos de ambiente, detalles, personas y momentos clave del evento con una edición dinámica, trabajando el movimiento, la música y el ritmo para construir piezas con una identidad visual definida. Un enfoque pensado para mantener una imagen limpia y sofisticada sin perder la energía natural de una noche de verano en Bossa Playa, Torrox.',
    format: 'vertical',
    poster: '/projects/sunrise-session-poster.png',
    logo: '/logos/bossa-bora.png',
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
    text: 'La mejor discoteca de Málaga, la música y la arquitectura del espacio marcan el lenguaje de las distintas producciones realizadas para Santa Rita. Contenido dedicado a aftermovies, conciertos y piezas audiovisuales que exploran el club desde diferentes registros, alternando momentos de mayor intensidad con imágenes más atmosféricas para construir una narrativa que se siente viva y contemporánea. Una línea visual conectada además con el universo de Tinglao Club, donde ambas propuestas comparten una misma sensibilidad audiovisual sin perder su propia personalidad.',
    format: 'vertical',
    images: ['https://www.youtube.com/shorts/tPTqbJAIIp4'],
    poster: '/projects/marruecos-poster.png',
    logo: '/logos/santa-rita.png',
    introMedia: 'video',
    noReels: true,
  },
  {
    title: 'Nvoga',
    text: 'La arquitectura y el entorno se convierten en los protagonistas de un contenido pensado para mostrar propiedades excepcionales de Marbella desde una perspectiva más cinematográfica. Vídeo, reels y tomas FPV permiten recorrer cada vivienda, revelar sus dimensiones y establecer una relación entre los espacios interiores, la arquitectura y el paisaje. El movimiento de cámara y la composición adquieren aquí un papel esencial, buscando que cada propiedad se perciba no solo como un inmueble, sino como una experiencia espacial.',
    format: 'horizontal',
    poster: '/projects/apertura-aurora-poster.png',
    logo: '/logos/nvoga.png',
    logoBackground: 'rgba(6, 6, 7, 0.82)',
    images: nvogaPhotos,
  },
  {
    title: 'Boda',
    text: 'La esencia de una boda no siempre está en los grandes momentos, sino en todo aquello que sucede alrededor de ellos. Una mirada, una conversación, la luz al final de la tarde o un gesto inesperado pueden terminar definiendo el recuerdo de un día entero.\n\nLa producción audiovisual parte de esa observación para construir historias honestas, elegantes y personales, adaptadas a cada celebración y a quienes la protagonizan. Muchas de estas producciones se realizan en colaboración con Mesaveintiuno, compartiendo una misma sensibilidad por la imagen y por la forma de contar cada historia.',
    format: 'horizontal',
    videos: ['https://www.youtube.com/watch?v=kXcbQy-i_D8'],
    poster: '/projects/rooftop-vows-poster.png',
    logo: null,
    images: bodaCoverPhotos,
    reelsCarousel: [
      'https://www.youtube.com/watch?v=cR0v8KmsT7U',
      'https://www.youtube.com/watch?v=-9aPnZeAlvE',
      'https://www.youtube.com/watch?v=2GvywbVXA7U',
    ],
    reelsCarouselRatio: '4 / 3',
    reelsCarouselWidth: 'clamp(240px, 30vw, 420px)',
    photoCollage: toCollage(bodaPhotos, 16),
    photoCollageRatio: '2.6 / 1',
    photoCollageShape: 'mosaic',
  },
]

export const PROJECTS = SEEDS.map(({ title, format, poster, logo, logoBackground, videos = [], images = [], reels = [], text = '', sections = [], noReels = false, noIntroImage = false, introMedia = 'photo', photoCollage = [], photoCollageRatio = '2 / 1', photoCollageShape = 'rect', reelsCarousel = [], reelsCarouselRatio = '9 / 16', reelsCarouselWidth = undefined, sideImages = [] }) => ({
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
  noIntroImage,
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
