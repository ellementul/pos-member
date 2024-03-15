import test from 'ava'

import { POS } from './POS.js'

test("Constructor", t => {
  const pos = new POS
  t.truthy(pos)
})

test("Add and Get node", t => {
  const pos = new POS

  const testingUUid = pos.addPoint()
  t.truthy(testingUUid)

  const userdata = { testingUUid }
  const pointBelowUuid = pos.addPoint({ userdata })
  t.truthy(pointBelowUuid)

  t.deepEqual(pos.get(pointBelowUuid), {
    uuid: pointBelowUuid,
    userdata,
    pointsBelow: [],
    pointsAbove: []
  })

  const pointAboveUuid = pos.addPoint({ pointsBelow: [pointBelowUuid] })
  t.truthy(pointAboveUuid)

  t.deepEqual(pos.get(pointBelowUuid), {
    uuid: pointBelowUuid,
    userdata,
    pointsBelow: [],
    pointsAbove: [pointAboveUuid]
  })

  t.deepEqual(pos.get(pointAboveUuid), {
    uuid: pointAboveUuid,
    userdata: {},
    pointsBelow: [pointBelowUuid],
    pointsAbove: []
  })

})


test("Add and Delete Realtion", t => {
  const pos = new POS

  const pointBelowUuid = pos.addPoint()
  const pointAboveUuid = pos.addPoint()
  pos.addLine({ below: pointBelowUuid, above: pointAboveUuid })

  t.like(pos.get(pointBelowUuid), {
    pointsBelow: [],
    pointsAbove: [pointAboveUuid]
  })

  t.like(pos.get(pointAboveUuid), {
    pointsBelow: [pointBelowUuid],
    pointsAbove: []
  })

  pos.deleteLine({ below: pointBelowUuid, above: pointAboveUuid })

  t.like(pos.get(pointBelowUuid), {
    pointsAbove: []
  })

  t.like(pos.get(pointAboveUuid), {
    pointsBelow: []
  })

})

test("Delete Node", t => {
  const pos = new POS

  const pointBelowUuid = pos.addPoint()
  const pointAboveUuid = pos.addPoint()
  pos.addLine({ pointBelow: pointBelowUuid, pointAbove: pointAboveUuid })

  pos.deletePoint(pointBelowUuid)

  t.like(pos.get(pointAboveUuid), {
    pointsBelow: []
  })

  t.falsy(pos.get(pointBelowUuid))
})

test("Get All pointsBelow", t => {
  const pos = new POS

  const pointsBelow = [pos.addPoint(), pos.addPoint()]
  const pointsAbove = [pos.addPoint({ pointsBelow }), pos.addPoint({ pointsBelow }), pos.addPoint({ pointsBelow })]
  const leaf = pos.addPoint({ pointsBelow: pointsAbove })

  t.deepEqual(pos.getAllPointsBelow(leaf), [...pointsAbove, ...pointsBelow])
})

test("Get All pointsAbove", t => {
  const pos = new POS

  const pointsBelow = [pos.addPoint(), pos.addPoint()]
  const pointsAbove = [pos.addPoint({ pointsBelow }), pos.addPoint({ pointsBelow }), pos.addPoint({ pointsBelow })]
  const leaf = pos.addPoint({ pointsBelow: pointsAbove })

  t.deepEqual(pos.getAllPointsAbove(pointsBelow[0]), [...pointsAbove, leaf])
})

test("Try to create Loop", t => {
  const pos = new POS

  const pointBelowUuid = pos.addPoint()
  const pointAboveUuid = pos.addPoint()
  pos.addLine({ below: pointBelowUuid, above: pointAboveUuid })
  t.throws(
    () => pos.addLine({ below: pointAboveUuid, above: pointBelowUuid }),
    { message: "I cannot create this relation, it will make loop!" }
  )
})