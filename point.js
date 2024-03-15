import { Types } from '@ellementul/united-events-environment'

const randomUUID = Types.UUID.Def().rand

export class Point {

  constructor(getPointByUUID, userdata) {
    this.getPointByUUID = getPointByUUID
    this.userdata = userdata,
    this.uuid = randomUUID()
    this.linesBelow = new Set(),
    this.linesAbove = new Set()
  }

  get isRoot() {
    return this.linesBelow.size === 0
  }

  get isLeaf() {
    return this.linesAbove.size === 0
  }

  get roots() {
    const points = new Set

    this.eachPointsTo(uuid => {
      if(this.getPointByUUID(uuid).isRoot)
        points.add(uuid)
    }, "linesBelow")

    return points
  }

  get leaves() {
    const points = new Set

    this.eachPointsTo(uuid => {
      if(this.getPointByUUID(uuid).isLeaf)
        points.add(uuid)
    }, "linesAbove")

    return points
  }

  addBelowLine(pointBelow) {
    this.linesBelow.add(pointBelow.uuid)
  }

  addAboveLine(pointAbove) {
    this.linesAbove.add(pointAbove.uuid)
  }

  deleteBelowLine(pointBelow) {
    this.linesBelow.delete(pointBelow.uuid)  
  }

  deleteAboveLine(pointAbove) {
    this.linesAbove.delete(pointAbove.uuid)
  }

  eachPointsTo(callback, to) {
    let uuidsToCheck = new Set(this[to])
    let checkedUuids = new Set

    while (uuidsToCheck.size > 0) {

      const [currentPoint] = uuidsToCheck
      uuidsToCheck.delete(currentPoint)

      for (const newPointToCheck of this.getPointByUUID(currentPoint)[to]) {
        if(!checkedUuids.has(newPointToCheck))
          uuidsToCheck.add(newPointToCheck)
      }
      
      checkedUuids.add(currentPoint)
      callback(currentPoint)
    }
  }

  isBelowThen(point) {
    let isPoint = false

    this.eachPointsTo(uuid => isPoint ||= (uuid === point.uuid), "linesAbove")

    return isPoint
  }

  isAboveThen(point) {
    let isPoint = false

    this.eachPointsTo(uuid => isPoint ||= (uuid === point.uuid), "linesBelow")

    return isPoint
  }
}