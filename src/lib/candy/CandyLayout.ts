export class CandyLayout {
  public width: number
  public height: number
  public top: number 
  public left: number 
  public bottom: number 
  public right: number

  static default(box = 1000, offset = 0): CandyLayout {
    return new CandyLayout({
      width: box,
      height: box,
      top: offset,
      left: offset
    })
  }

  constructor ({width, height, top, left, bottom = null, right = null}: any) {
    this.width = width
    this.height = height
    this.top = top
    this.left = left
    this.bottom = bottom || height + top
    this.right = right || width + left
  }
}