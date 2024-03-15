import { Point } from './point.js'

export class POS {
  constructor () {
    this.points = new Map
    this.roots = new Set
    this.leaves = new Set
  }

  get (uuid) {
    if(!this.points.has(uuid))
      return null

    const point = this.points.get(uuid)
    return {
      uuid,
      userdata: point.userdata,
      linesBelow: Array.from(point.linesBelow),
      linesAbove: Array.from(point.linesAbove),
      roots: Array.from(point.roots),
      leaves: Array.from(point.leaves)
    }
  }

  addPoint({ userdata = {}, linesBelow = [], linesAbove = [] } = {}) {
    const getPointByUUID = uuid => this.points.get(uuid) 
    const point = new Point(getPointByUUID, userdata)

    this.points.set(point.uuid, point)
    this.roots.add(point.uuid)
    this.leaves.add(point.uuid)

    for (const below of linesBelow)
      this.addLine({ below, above: point.uuid })

    for (const above of linesAbove)
      this.addLine({ below: point.uuid, above })

    return point.uuid
  }

  deletePoint(uuid) {
    const point = this.points.get(uuid)

    for (const below of point.linesBelow)
      this.deleteLine({ below, above: uuid })

    for (const above of point.linesAbove)
      this.deleteLine({ below: uuid, above })

    this.points.delete(uuid)
  }

  addLine({ below, above }) {
    this.checkLine({ below, above })

    const pointBelow = this.points.get(below)
    const pointAbove = this.points.get(above)

    if(pointBelow.isAboveThen(pointAbove))
      throw new Error(`I cannot create this line: ` + JSON.stringify({ below, above }) + `it will make loop!`)

    pointAbove.addBelowLine(pointBelow)
    pointBelow.addAboveLine(pointAbove)

    this.roots.delete(pointAbove.uuid)
    this.leaves.delete(pointBelow.uuid)
  }

  deleteLine ({ below, above }) {
    this.checkLine({ below, above })

    const pointBelow = this.points.get(below)
    const pointAbove = this.points.get(above)

    pointAbove.deleteBelowLine(pointBelow)
    pointBelow.deleteAboveLine(pointAbove)

    if(pointAbove.isRoot)
      this.roots.add(pointAbove.uuid)

    if(pointBelow.isLeaf)
      this.leaves.add(pointBelow.uuid)
  }

  checkLine({ below, above }) {
    if(below === above)
      throw new Error("Point below can't be the same point that point above!")

    if(!this.points.has(below))
      throw new Error(`Point below with ${below} uuid isn't in POS!`)

    if(!this.points.has(above))
      throw new Error(`Point above with ${above} uuid isn't in POS!`)

    return
  }
}

