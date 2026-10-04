import Placeholder from './Placeholder'
import { responsiveImage } from '../utils/responsiveImage'
import './MosaicCollage.css'

// Eight columns across the full width — tiles are narrow but cropped
// (object-fit: cover) from landscape photos, so they need more pixels than
// their width alone suggests, especially once the block gets taller on phones.
const TILE_SIZES = '(max-width: 640px) 60vw, 25vw'

// An organic, rounded-silhouette brick mosaic — full width, columns that
// step shorter toward the outer edges and taller through the middle so
// the whole block reads as a wide oval/blob, not a rectangle. Each
// column stacks a different number of tiles at uneven heights (the
// "brick" mix), so it never falls into an obvious repeating grid.
const COLUMNS = [
  { heightPct: 50, widthFlex: 0.7, splits: [1] },
  { heightPct: 74, widthFlex: 0.85, splits: [1.2, 1] },
  { heightPct: 90, widthFlex: 0.95, splits: [1, 1.3] },
  { heightPct: 100, widthFlex: 1.15, splits: [1.1, 0.8, 1.1] },
  { heightPct: 100, widthFlex: 1.15, splits: [1, 1, 1] },
  { heightPct: 90, widthFlex: 0.95, splits: [1.3, 1] },
  { heightPct: 74, widthFlex: 0.85, splits: [1, 1.2] },
  { heightPct: 50, widthFlex: 0.7, splits: [1] },
]

function Tile({ item, flex }) {
  return (
    <div className="mosaic-collage__tile" style={{ flex }}>
      {item?.url ? (
        <img
          loading="lazy"
          decoding="async"
          {...responsiveImage(item.url, TILE_SIZES)}
          alt=""
          className="mosaic-collage__photo"
        />
      ) : (
        <Placeholder label="[ IMAGE ]" type="photo" className="mosaic-collage__placeholder" />
      )}
    </div>
  )
}

export default function MosaicCollage({ items = [] }) {
  if (items.length === 0) return null

  let cursor = 0

  return (
    <div className="mosaic-collage">
      {COLUMNS.map((col, ci) => {
        const colItems = items.slice(cursor, cursor + col.splits.length)
        cursor += col.splits.length
        return (
          <div
            key={ci}
            className="mosaic-collage__column"
            style={{ flex: col.widthFlex, height: `${col.heightPct}%` }}
          >
            {colItems.map((item, i) => (
              <Tile key={i} item={item} flex={col.splits[i]} />
            ))}
          </div>
        )
      })}
    </div>
  )
}
