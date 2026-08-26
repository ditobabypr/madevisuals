import './BrandLogo.css'

const LOGO_SRC = '/logo.png'
const BRAND_NAME = 'Madevisuals'

export default function BrandLogo({ size = 'md', className = '' }) {
  const classes = `brand-logo brand-logo--${size} ${className}`.trim()
  return <img src={LOGO_SRC} alt={BRAND_NAME} className={classes} />
}
