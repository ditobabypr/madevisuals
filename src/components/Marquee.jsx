export default function Marquee({ items, speed = 26 }) {
  return (
    <div className="marquee" style={{ '--marquee-duration': `${speed}s` }}>
      <div className="marquee__track">
        {[...items, ...items].map((item, i) => (
          <span className="marquee__item" key={i}>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
