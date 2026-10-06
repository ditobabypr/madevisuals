import { useEffect, useRef, useState } from 'react'

// Fires once an element's top edge passes the bottom 10% of the screen.
// Deliberately no ratio threshold: some revealed blocks (Xcape's story
// sections, collages) are taller than a phone screen, and waiting for 15%
// of them to be in view meant scrolling through ~300px of empty page.
export default function useReveal(threshold = 0) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin: '0px 0px -10% 0px' }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, visible]
}
