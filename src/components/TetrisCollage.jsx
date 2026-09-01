import Placeholder from './Placeholder'
import './TetrisCollage.css'

// A square photo wall built from nested flexbox splits (a "BSP tree"),
// not a grid. Every split divides 100% of its parent's space between its
// children via `flex: <weight>` — since flexbox always distributes the
// entirety of the available space, there is no way for a gap to appear,
// no matter what sizes the tiles end up at. Three fixed layouts (A/B/C)
// give each Xcape sub-section a visibly different tetris pattern while
// each one still tiles its square exactly, edge to edge.
//
// `Branch` is a flex box whose OWN children are arranged along
// `direction` (its children sit side-by-side under "row", stacked under
// "col"). `Leaf` is a plain flex-weighted slot holding one photo tile —
// it has no children to arrange, so it takes no direction.

function Leaf({ item, flex = 1 }) {
  return (
    <div className="tetris-collage__branch" style={{ flex }}>
      {item?.url ? (
        <img src={item.url} alt="" className="tetris-collage__tile tetris-collage__tile--image" />
      ) : (
        <Placeholder label="[ IMAGE ]" type="photo" className="tetris-collage__tile" />
      )}
    </div>
  )
}

function Branch({ direction, flex = 1, children }) {
  return (
    <div className={`tetris-collage__branch tetris-collage__branch--${direction}`} style={{ flex }}>
      {children}
    </div>
  )
}

// ROOT (row)
// ├─ col/3 [Left]
// │   ├─ row/1 [Top]      → leaf(0,2) | leaf(1,1)
// │   └─ row/2 [Bottom]   → leaf(2,1) | col/1 [BR] → leaf(3,1) / leaf(4,1)
// └─ col/2 [Right]        → leaf(5,1) / row/1[mid] (leaf(6,1)|leaf(7,1)) / leaf(8,1) / leaf(9,1)
function LayoutA({ items }) {
  const l = (i, flex) => <Leaf item={items[i]} flex={flex} />
  return (
    <>
      <Branch direction="col" flex={3}>
        <Branch direction="row" flex={1}>
          {l(0, 2)}
          {l(1, 1)}
        </Branch>
        <Branch direction="row" flex={2}>
          {l(2, 1)}
          <Branch direction="col" flex={1}>
            {l(3, 1)}
            {l(4, 1)}
          </Branch>
        </Branch>
      </Branch>
      <Branch direction="col" flex={2}>
        {l(5, 1)}
        <Branch direction="row" flex={1}>
          {l(6, 1)}
          {l(7, 1)}
        </Branch>
        {l(8, 1)}
        {l(9, 1)}
      </Branch>
    </>
  )
}

// ROOT (row)
// ├─ col/1 [Col1]  → leaf(0,2) / leaf(1,1) / leaf(2,1)
// ├─ col/1 [Col2]  → leaf(3,1) / row/2[mid] (leaf(4,1)|leaf(5,1)) / leaf(6,1)
// └─ col/1 [Col3]  → leaf(7,1) / leaf(8,1) / leaf(9,1)
function LayoutB({ items }) {
  const l = (i, flex) => <Leaf item={items[i]} flex={flex} />
  return (
    <>
      <Branch direction="col" flex={1}>
        {l(0, 2)}
        {l(1, 1)}
        {l(2, 1)}
      </Branch>
      <Branch direction="col" flex={1}>
        {l(3, 1)}
        <Branch direction="row" flex={2}>
          {l(4, 1)}
          {l(5, 1)}
        </Branch>
        {l(6, 1)}
      </Branch>
      <Branch direction="col" flex={1}>
        {l(7, 1)}
        {l(8, 1)}
        {l(9, 1)}
      </Branch>
    </>
  )
}

// ROOT (row)
// ├─ leaf/2 (0)                         [big single feature]
// └─ col/3 [Right]
//     ├─ row/1 [R1] → leaf(1,1)|leaf(2,1)|leaf(3,1)
//     ├─ row/1 [R2] → leaf(4,2) | col/1[R2b] (leaf(5,1)/leaf(6,1))
//     └─ row/1 [R3] → leaf(7,1)|leaf(8,1)|leaf(9,1)
function LayoutC({ items }) {
  const l = (i, flex) => <Leaf item={items[i]} flex={flex} />
  return (
    <>
      {l(0, 2)}
      <Branch direction="col" flex={3}>
        <Branch direction="row" flex={1}>
          {l(1, 1)}
          {l(2, 1)}
          {l(3, 1)}
        </Branch>
        <Branch direction="row" flex={1}>
          {l(4, 2)}
          <Branch direction="col" flex={1}>
            {l(5, 1)}
            {l(6, 1)}
          </Branch>
        </Branch>
        <Branch direction="row" flex={1}>
          {l(7, 1)}
          {l(8, 1)}
          {l(9, 1)}
        </Branch>
      </Branch>
    </>
  )
}

// ROOT (row)
// ├─ col/2 [Left]   → leaf(0,1)          / row/1[Bottom] (leaf(1,1)|leaf(2,1))
// └─ col/1 [Right]  → leaf(3,1) / leaf(4,1)
function LayoutD({ items }) {
  const l = (i, flex) => <Leaf item={items[i]} flex={flex} />
  return (
    <>
      <Branch direction="col" flex={2}>
        {l(0, 1)}
        <Branch direction="row" flex={1}>
          {l(1, 1)}
          {l(2, 1)}
        </Branch>
      </Branch>
      <Branch direction="col" flex={1}>
        {l(3, 1)}
        {l(4, 1)}
      </Branch>
    </>
  )
}

// A long five-column strip — each column subdivides its full height
// differently, so the rhythm keeps changing left to right: one whole
// photo, two even halves, two uneven splits (leaning one way then the
// other), one whole photo again. Column widths vary too, not just the
// splits inside them.
// ROOT (row)
// ├─ col/1.3 → leaf(0)                     [whole]
// ├─ col/0.9 → leaf(1,1) / leaf(2,1)        [even halves]
// ├─ col/0.9 → leaf(3,1.6) / leaf(4,1)      [uneven, top-heavy]
// ├─ col/0.9 → leaf(5,1) / leaf(6,1.6)      [uneven, bottom-heavy]
// └─ col/1.1 → leaf(7)                     [whole]
function LayoutE({ items }) {
  const l = (i, flex) => <Leaf item={items[i]} flex={flex} />
  return (
    <>
      <Branch direction="col" flex={1.3}>
        {l(0, 1)}
      </Branch>
      <Branch direction="col" flex={0.9}>
        {l(1, 1)}
        {l(2, 1)}
      </Branch>
      <Branch direction="col" flex={0.9}>
        {l(3, 1.6)}
        {l(4, 1)}
      </Branch>
      <Branch direction="col" flex={0.9}>
        {l(5, 1)}
        {l(6, 1.6)}
      </Branch>
      <Branch direction="col" flex={1.1}>
        {l(7, 1)}
      </Branch>
    </>
  )
}

// 15 photos in just 5 columns — each column stacks a different number of
// tiles (2, 4, 3, 4, 2) with uneven splits inside, so it stays "mezclado"
// without needing more columns. Same overall strip height as before.
// ROOT (row)
// ├─ col/0.9 → leaf(0,1.5) / leaf(1,1)                              [uneven pair]
// ├─ col/1.1 → leaf(2,1.3) / leaf(3,0.8) / leaf(4,1.2) / leaf(5,0.9)  [four, mixed]
// ├─ col/1.0 → leaf(6,1.4) / leaf(7,1) / leaf(8,0.7)                 [uneven thirds]
// ├─ col/1.1 → leaf(9,0.9) / leaf(10,1.3) / leaf(11,0.8) / leaf(12,1.1) [four, different rhythm]
// └─ col/0.9 → leaf(13,1) / leaf(14,1.6)                            [uneven pair, flipped]
function LayoutF({ items }) {
  const l = (i, flex) => <Leaf item={items[i]} flex={flex} />
  return (
    <>
      <Branch direction="col" flex={0.9}>
        {l(0, 1.5)}
        {l(1, 1)}
      </Branch>
      <Branch direction="col" flex={1.1}>
        {l(2, 1.3)}
        {l(3, 0.8)}
        {l(4, 1.2)}
        {l(5, 0.9)}
      </Branch>
      <Branch direction="col" flex={1}>
        {l(6, 1.4)}
        {l(7, 1)}
        {l(8, 0.7)}
      </Branch>
      <Branch direction="col" flex={1.1}>
        {l(9, 0.9)}
        {l(10, 1.3)}
        {l(11, 0.8)}
        {l(12, 1.1)}
      </Branch>
      <Branch direction="col" flex={0.9}>
        {l(13, 1)}
        {l(14, 1.6)}
      </Branch>
    </>
  )
}

const LAYOUTS_15 = [LayoutF]
const LAYOUTS_10 = [LayoutA, LayoutB, LayoutC]
const LAYOUTS_8 = [LayoutE]
const LAYOUTS_5 = [LayoutD]

export default function TetrisCollage({ items = [], variant = 0, ratio = '1 / 1' }) {
  if (items.length === 0) return null

  const layouts =
    items.length <= 5 ? LAYOUTS_5
    : items.length <= 8 ? LAYOUTS_8
    : items.length <= 10 ? LAYOUTS_10
    : LAYOUTS_15
  const Layout = layouts[variant % layouts.length]

  return (
    <div className="tetris-collage" style={{ aspectRatio: ratio }}>
      <Layout items={items} />
    </div>
  )
}
