import { lazy } from 'react'

// Home loads eagerly (it's the entry point); the rest split into their own
// chunks so a first visit only pays for the page it lands on.
const loaders = {
  projects: () => import('./pages/Projects'),
  projectDetail: () => import('./pages/ProjectDetail'),
  about: () => import('./pages/About'),
  contact: () => import('./pages/Contact'),
  notFound: () => import('./pages/NotFound'),
}

export const Projects = lazy(loaders.projects)
export const ProjectDetail = lazy(loaders.projectDetail)
export const About = lazy(loaders.about)
export const Contact = lazy(loaders.contact)
export const NotFound = lazy(loaders.notFound)

export function prefetchAllPages() {
  Object.values(loaders).forEach((load) => load().catch(() => {}))
}

// Called the moment a transition starts, so the page's code downloads
// while the cover animates in rather than after it. A no-op once loaded.
export function prefetchPath(path) {
  const load =
    path === '/proyectos' ? loaders.projects
    : path.startsWith('/proyectos/') ? loaders.projectDetail
    : path === '/sobre-mi' ? loaders.about
    : path === '/contacto' ? loaders.contact
    : path === '/' ? null
    : loaders.notFound
  load?.().catch(() => {})
}
