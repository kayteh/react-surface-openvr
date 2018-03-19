import { CandyLayout } from "./CandyLayout"
import { CandyStyle } from "./CandyStyle"

type MeasureFunc = (width: number) => Size

export class CandyNode {
  private parentNode?: CandyNode = null
  private measureFunc?: MeasureFunc
  private dimensions: CandyLayout = CandyLayout.default()
  private calcSize?: Size

  private dirty: boolean = false
  private calculated: boolean = false
  
  public children: Set<CandyNode> = new Set()
  public style: CandyStyle = new CandyStyle(this)

  markDirty (): void {
    this.dirty = true
  }

  setParentNode (node: CandyNode | null): void {
    this.parentNode = node
    this.markDirty()
  }

  addChildAt (node: CandyNode, index: number = -1): void {
    this.children = new Set(Array.from(this.children).splice(index, 0, node))
    node.setParentNode(this)
    this.markDirty()    
  }

  addChild (node: CandyNode): void {
    this.children.add(node)
    node.setParentNode(this)
    this.markDirty()    
  }

  removeChildren (): void {
    for (let child of this.children) {
      child.setParentNode(null)
      child.reset()
    }

    this.children = new Set()
    this.markDirty()    
  }

  removeChild (node: CandyNode): void {
    this.children.delete(node)
    node.setParentNode(null)
    this.markDirty()    
  }

  measureWith (func: MeasureFunc): void {
    this.measureFunc = func
    this.markDirty()    
  }

  reset (): void {
    this.measureFunc = undefined
    this.removeChildren()
    this.parentNode = null
    this.dirty = false
    this.calculated = false
  }

  get computedLayout (): CandyLayout {
    return this.dimensions
  }

  calculateLayout (width: number, height: number): void {
    if (!this.dirty && this.calculated) {
      return
    }

    if (this.children.size > 0) {
      for (let child of this.children) {
        if (child == null) continue
        if (!this.calculated) child.markDirty()
        child.calculateLayout.call(child, width, height)
      }
    }

    this.dimensions = new CandyLayout({
      ...this.nodeDimensions,
      top: 0, 
      left: 0
    })

    this.calcSize = { width, height }
    this.dirty = false
    this.calculated = true
    console.debug('finished calc, node:', this,)
  }

  get nodeDimensions (): Size {
    // TODO: i thnk we're always using content-box, possibly make configurable.
    // border-box means content-box size === width/h - padding - border
    // content-box means border-box size === width/h + padding + border

    // get all size modifiers per edge
    const style = this.style
    
    // non-content sizing
    const [bT, bR, bB, bL] = style.borders
    const [mT, mR, mB, mL] = style.margins // do i need this?
    const [pT, pR, pB, pL] = style.paddings

    // deltas
    const widthD = bR + bL + pR + pL
    const heightD = bT + bB + pT + pB

    // content sizing
    let {
      width = 0,
      height = 0
    } = style

    // if there's a measure function, it takes precedence for w/h numbers, but not before flex.
    if (this.measureFunc != null) {
      const s = this.measureFunc(width)
      width = s.width
      height = s.height
    }


    // flex measurements, only works if there's a parent to calculate from.
    if (this.parentNode != null) {
      const fu = this.parentNode.flexUnits
      const cs = this.parentNode.children.size
      const pdim = this.parentNode.nodeDimensions

      // so.. this math is weird, so let's talk it out.
      // given fu = 3, this node has grow: 1.
      // this node will get a flex weight of 1, and use 1/3rd of the space
      // given fu = 3, and grow: 2
      // this node will be 2/3rds, so
      // formula is flexGrow/fu or basis width? idk.
      // i think basis width is calculating wrapping, unrelated to this part.

      const weight = this.style.flexGrow || 0
      const factor = (weight > 0) ? weight/fu : 1

      // if we're doing row, we care about width, if not, we care about height.
      if (
        style.flexDirection == null || 
        style.flexDirection === 'row' || 
        style.flexDirection === 'row-reverse'
      ) {
        width = pdim.width * factor
      } else {
        height = pdim.height * factor
      }

    } else {
      // assume full width i guess?
      if (this.calcSize != null) {
        width = this.calcSize.width
        height = this.calcSize.height
      }
    }
    
    const { 
      maxWidth, 
      minWidth,
      maxHeight,
      minHeight
    } = style

    
    width = minmax(width + widthD, minWidth || 0, maxWidth || 1000000)
    height = minmax(height + heightD, minHeight || 0, maxHeight || 1000000)

    // if there's children, we need to calculate everything of their's all the way down the tree, 
    // and add it to the w/h
    let widthC = 0
    let heightC = 0
    // we don't blindly add it to w/h, though. w/hC is our pre-delta for it, which if it's smaller
    // then we don't adjust. this is still useful info for flexShrink though.
    // 
    if (this.children.size > 0) {
      for (let child of this.children) {
        widthC += child.dimensions.width
        heightC += child.dimensions.height
      }
    }

    // afaik this should be above minHeight by now.
    width = minmax(widthC, width, maxWidth)
    height = minmax(heightC, height, maxHeight)

    // unconstrained adds, i think...
    width += mR + mL
    height += mT + mB

    return {
      width,
      height
    }
  }

  get flexUnits(): number {
    return Array.from(this.children).reduce(
      (acc, val): number => 
        acc + Math.max((val.style.flexGrow || 0), (val.style.flexShrink || 0)), 0)
  }
}

function minmax(val: number, min: number, max: number): number {
  return Math.max(Math.min(val, max), min)
}