import './BrandLogo.css'

const LOGO_SRC = 'https://res.cloudinary.com/xawdx2ki/image/upload/v1787931093/made_abstracto.png'
const BRAND_NAME = 'Madevisuals'

export default function BrandLogo({ size = 'md', className = '' }) {
  const classes = `brand-logo brand-logo--${size} ${className}`.trim()
  return <img src={LOGO_SRC} alt={BRAND_NAME} className={classes} />
}
