import { Types } from '@ellementul/united-events-environment'
const randomUUID = Types.UUID.Def().rand

export class POS {
  constructor () {
    this.points = new Map
    this.roots = new Set
    this.leaves = new Set
  }

  get (uuid) {
    if(!this.points.has(uuid))
      return null

    const { userdata, pointsAbove, pointsBelow } = this.points.get(uuid)
    return {
      uuid,
      userdata,
      pointsBelow: Array.from(pointsBelow),
      pointsAbove: Array.from(pointsAbove)
    }
  }

  getAllPointsBelow(uuid, toArray=true) {
    return this.getAllPointsByDirect(uuid, "pointsBelow", toArray)
  }

  getAllPointsAbove(uuid, toArray=true) {
    return this.getAllPointsByDirect(uuid, "pointsAbove", toArray)
  }

  getAllPointsByDirect(uuid, direct, toArray) {
    if(!this.points.has(uuid))
      return toArray ? [] : new Set

    let pointsToCheck = new Set(this.points.get(uuid)[direct])
    let checkedPoints = new Set

    while (pointsToCheck.size > 0) {

      const [currentPoint] = pointsToCheck

      for (const newPointToCheck of this.points.get(currentPoint)[direct]) {
        if(!checkedPoints.has(newPointToCheck))
          pointsToCheck.add(newPointToCheck)
      }

      pointsToCheck.delete(currentPoint)
      checkedPoints.add(currentPoint)
    }

    return toArray ? [...checkedPoints] : checkedPoints
  }

  addPoint({ userdata = {}, pointsBelow = [], pointsAbove = [] } = {}) {
    const uuid = randomUUID()

    this.points.set(uuid, {
      uuid,
      userdata,
      pointsBelow: new Set(),
      pointsAbove: new Set()
    })

    for (const below of pointsBelow)
      this.addLine({ below, above: uuid })

    for (const above of pointsAbove)
      this.addLine({ below: uuid, above })

    if(this.points.get(uuid).pointsBelow.size === 0)
      this.roots.add(uuid)

    if(this.points.get(uuid).pointsAbove.size === 0)
      this.leaves.add(uuid)

    return uuid
  }

  deletePoint(uuid) {
    const point = this.points.get(uuid)

    for (const below of point.pointsBelow)
      this.deleteLine({ below, above: uuid })

    for (const above of point.pointsAbove)
      this.deleteLine({ below: uuid, above })

    this.points.delete(uuid)
  }

  addLine({ below, above }) {
    if(below == above)
      return

    if(this.getAllPointsBelow(below, false).has(above))
      throw new Error("I cannot create this relation, it will make loop!")

    const pointBelow = this.points.get(below)
    const pointAbove = this.points.get(above)

    this.addBelowLine(pointAbove, below)
    this.addAboveLine(pointBelow, above)
  }

  addBelowLine(point, pointBelow) {
    if(!this.points.has(pointBelow))
      throw new Error(`Point below with ${pointBelow} uuid isn't in POS!`)

    point.pointsBelow.add(pointBelow)
    this.roots.delete(point.uuid)
  }

  addAboveLine(point, pointAbove) {
    if(!this.points.has(pointAbove))
      throw new Error(`Point above with ${pointAbove} uuid isn't in POS!`)

    point.pointsAbove.add(pointAbove)
    this.leaves.delete(point.uuid)
  }

  deleteLine ({ below, above }) {
    const pointBelowNode = this.points.get(below)
    const pointAboveNode = this.points.get(above)

    this.deleteBelowLine(pointAboveNode, below)
    this.deleteAboveLine(pointBelowNode, above)
  }

  deleteBelowLine(point, pointBelow) {
    point.pointsBelow.delete(pointBelow)

    if(point.pointsBelow.size == 0)
      this.roots.add(point.uuid)
  }

  deleteAboveLine(point, pointAbove) {
    point.pointsAbove.delete(pointAbove)

    if(point.pointsAbove.size == 0)
      this.leaves.add(point.uuid)
  }
}