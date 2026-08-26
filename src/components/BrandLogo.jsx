import './BrandLogo.css'

// To swap in the real brand mark: drop the file at public/logo.svg (or .png)
// and flip HAS_LOGO_FILE to true. Every <BrandLogo /> usage (navbar, footer,
// intro screen, page transitions) updates automatically — no other code
// needs to change.
const HAS_LOGO_FILE = false
const LOGO_SRC = '/logo.svg'
const BRAND_NAME = 'Madevisuals'

export default function BrandLogo({ size = 'md', className = '' }) {
  const classes = `brand-logo brand-logo--${size} ${className}`.trim()

  if (HAS_LOGO_FILE) {
    return <img src={LOGO_SRC} alt={BRAND_NAME} className={classes} />
  }

  if (size === 'lg') {
    return (
      <span className={`${classes} brand-logo--placeholder-lg`}>
        [ LOGO DE LA MARCA ]
      </span>
    )
  }

  return <span className={classes}>MADEVISUALS</span>
}
