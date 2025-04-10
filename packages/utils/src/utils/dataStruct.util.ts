export class Point {
  x: number
  y: number
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
}

export class Line {
  start: Point
  end: Point
  constructor(start: Point, end: Point) {
    this.start = start
    this.end = end
  }
}

type GridMapOptions = {
  width: number
  height: number
  minCellSize: number | [number, number]
}
export class GridMap<CellType> {
  width: number
  height: number
  minCellSize: [number, number]
  cells: Map<string, CellType | null> = new Map()
  rowNum: number = 0
  colNum: number = 0
  constructor(options: GridMapOptions) {
    const { width, height, minCellSize } = options
    this.width = width
    this.height = height
    this.minCellSize = Array.isArray(minCellSize) ? minCellSize : [minCellSize, minCellSize]
  }

  init() {
    const { width, height, minCellSize } = this
    this.colNum = Math.ceil(width / minCellSize[0])
    this.rowNum = Math.ceil(height / minCellSize[1])
    this.cells = new Map()
    for (let i = 0; i < this.rowNum; i++) {
      for (let j = 0; j < this.colNum; j++) {
        this.cells.set(`${i}-${j}`, null)
      }
    }
  }

  setCell(cellId: string, cell: CellType) {
    if (this.cells.has(cellId)) {
      throw new Error(`cellId: ${cellId} not exists`)
    }
    this.cells.set(cellId, cell)
  }

  getCell(cellId: string) {
    return this.cells.get(cellId)
  }
}
