import './LogoMark.css'

// The "eye" mark alone — used for the intro splash and page transitions.
// Swap by replacing /public/logo.png.
const LOGO_SRC = '/logo.png'

export default function LogoMark({ className = '' }) {
  return <img src={LOGO_SRC} alt="Madevisuals" className={`logo-mark ${className}`.trim()} />
}
