import { CandyNode } from './CandyNode'

export class CandyStyle {
  private owner?: CandyNode

  update (prop: string, value: any): void {
    if (prop in this) {
      this[prop] = value
    }

    if (this.owner != null) {
      this.owner.markDirty()
    }
  }

  constructor (owner?: CandyNode) {
    this.owner = owner
  }

  [x: string]: any
  position: 'absolute' | 'relative' = null
  alignContent: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'stretch' = null
  alignItems: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch' = null
  alignSelf: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch' = null
  flexAlign: any = null
  flexBasis: SurfaceValue = null
  flexDirection: 'row' | 'row-reverse' | 'column' | 'column-reverse' = null
  flexFlow: string = null
  flexGrow: SurfaceValue = null
  flexItemAlign: any = null
  flexLinePack: any = null
  flexOrder: any = null
  flexShrink: SurfaceValue = null
  flexWrap: 'nowrap' | 'wrap' | 'wrap-reverse' = null
  top: SurfaceValueP = null
  right: SurfaceValueP = null
  bottom: SurfaceValueP = null
  left: SurfaceValueP = null
  width: SurfaceValueP = null
  height: SurfaceValueP = null
  minWidth: SurfaceValueP = null
  minHeight: SurfaceValueP = null
  maxWidth: SurfaceValueP = null
  maxHeight: SurfaceValueP = null
  justifyContent: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' = null
  margin: SurfaceValueP = null
  marginBottom: SurfaceValueP = null
  marginLeft: SurfaceValueP = null
  marginRight: SurfaceValueP = null
  marginTop: SurfaceValueP = null

  get margins (): [SurfaceValueP, SurfaceValueP, SurfaceValueP, SurfaceValueP] {
    return [
      this.marginTop || this.margin || 0,
      this.marginRight || this.margin || 0,
      this.marginBottom || this.margin || 0,
      this.marginLeft || this.margin || 0
    ]
  }

  padding: SurfaceValueP = null
  paddingBottom: SurfaceValueP = null
  paddingLeft: SurfaceValueP = null
  paddingRight: SurfaceValueP = null
  paddingTop: SurfaceValueP = null

  get paddings (): [SurfaceValueP, SurfaceValueP, SurfaceValueP, SurfaceValueP] {
    return [
      this.paddingTop || this.padding || 0,
      this.paddingRight || this.padding || 0,
      this.paddingBottom || this.padding || 0,
      this.paddingLeft || this.padding || 0
    ]
  }

  border: SurfaceValueP = null
  borderTop: SurfaceValueP = null
  borderRight: SurfaceValueP = null
  borderBottom: SurfaceValueP = null
  borderLeft: SurfaceValueP = null

  get borders (): [SurfaceValueP, SurfaceValueP, SurfaceValueP, SurfaceValueP] {
    return [
      this.borderTop || this.border || 0,
      this.borderRight || this.border || 0,
      this.borderBottom || this.border || 0,
      this.borderLeft || this.border || 0
    ]
  }

  overflow: 'visible' | 'hidden' | 'scroll' = null
  opacity: SurfaceValue = null
}
