import { useLocation } from 'react-router-dom'
import { useTransition } from './TransitionContext'

// Drop-in replacement for react-router's <Link> that plays the branded
// cover/reveal animation before actually changing route.
export default function TransitionLink({ to, children, className, onClick, ...rest }) {
  const { go } = useTransition()
  const location = useLocation()

  const handleClick = (e) => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return
    }
    e.preventDefault()
    onClick?.(e)
    if (to !== location.pathname) go(to)
  }

  return (
    <a href={to} className={className} onClick={handleClick} {...rest}>
      {children}
    </a>
  )
}
