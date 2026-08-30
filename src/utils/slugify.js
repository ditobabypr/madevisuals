// Turns a project title into a clean, accent-free URL slug -- the same
// function is used wherever a project is linked to (Work, Home filmstrip)
// and wherever it's looked up (the detail page route), so they can never
// drift out of sync with each other.
export function slugify(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
