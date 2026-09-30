import './BrandLogo.css'

// Drop-in folder: save the file as public/logos/brand-logo.png and it just
// works, no code change needed.
const LOGO_SRC = '/logos/brand-logo.png'
const BRAND_NAME = 'Madevisuals'

export default function BrandLogo({ size = 'md', className = '' }) {
  const classes = `brand-logo brand-logo--${size} ${className}`.trim()
  return <img src={LOGO_SRC} alt={BRAND_NAME} className={classes} />
}
