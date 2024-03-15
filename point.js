import { Types } from '@ellementul/united-events-environment'
const randomUUID = Types.UUID.Def().rand

export class Point {
  constructor(userdata) {
    this.userdata = userdata,
    this.uuid = randomUUID()
    this.linesBelow = new Set(),
    this.linesAbove = new Set(),
    this.roots = new Set(),
    this.leaves = new Set()
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

      for (const newPointToCheck of currentPoint[to]) {
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