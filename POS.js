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

    const { userdata, linesAbove, linesBelow } = this.points.get(uuid)
    return {
      uuid,
      userdata,
      linesBelow: Array.from(linesBelow),
      linesAbove: Array.from(linesAbove)
    }
  }

  addPoint({ userdata = {}, linesBelow = [], linesAbove = [] } = {}) {
    const point = new Point(userdata)

    this.points.set(point.uuid, point)

    for (const below of linesBelow)
      this.addLine({ below, above: point.uuid })

    for (const above of linesAbove)
      this.addLine({ below: point.uuid, above })

    if(point.linesBelow.size === 0)
      this.roots.add(point.uuid)

    if(point.linesAbove.size === 0)
      this.leaves.add(point.uuid)

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
      throw new Error(`I cannot create this line: ${ { below, above } }, it will make loop!`)

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

    if(pointAbove.linesBelow.size == 0)
      this.roots.add(pointAbove.uuid)

    if(pointBelow.linesAbove.size == 0)
      this.leaves.add(pointBelow.uuid)
  }

  checkLine({ below, above }) {
    if(below == above)
      throw new Error("Point below can't be the same point that point above!")

    if(!this.points.has(below))
      throw new Error(`Point below with ${below} uuid isn't in POS!`)

    if(!this.points.has(above))
      throw new Error(`Point above with ${above} uuid isn't in POS!`)

    return
  }
}

