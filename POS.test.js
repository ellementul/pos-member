import test from 'ava'

import { POS } from './POS.js'

test("Constructor", t => {
  const pos = new POS
  t.truthy(pos)
})

test("Add Point", t => {
  const pos = new POS

  const pointUuid = pos.addPoint()

  t.deepEqual(pos.get(pointUuid), {
    uuid: pointUuid,
    linesBelow: [],
    linesAbove: [],
    userdata: {}
  })

})

test("Add and Delete Lines", t => {
  const pos = new POS

  const pointBelowUuid = pos.addPoint()
  const pointAboveUuid = pos.addPoint()
  pos.addLine({ below: pointBelowUuid, above: pointAboveUuid })

  t.like(pos.get(pointBelowUuid), {
    linesBelow: [],
    linesAbove: [pointAboveUuid]
  })

  t.like(pos.get(pointAboveUuid), {
    linesBelow: [pointBelowUuid],
    linesAbove: [],
    // roots: [pointBelowUuid]
  })

  pos.deleteLine({ below: pointBelowUuid, above: pointAboveUuid })

  t.like(pos.get(pointBelowUuid), {
    linesAbove: []
  })

  t.like(pos.get(pointAboveUuid), {
    linesBelow: []
  })

})

test("Add Node with Lines", t => {
  const pos = new POS

  const testingUUid = pos.addPoint()
  t.truthy(testingUUid)

  const userdata = { testingUUid }
  const pointBelowUuid = pos.addPoint({ userdata })
  t.truthy(pointBelowUuid)

  t.deepEqual(pos.get(pointBelowUuid), {
    uuid: pointBelowUuid,
    userdata,
    linesBelow: [],
    linesAbove: []
  })

  const pointAboveUuid = pos.addPoint({ linesBelow: [pointBelowUuid] })
  t.truthy(pointAboveUuid)

  t.deepEqual(pos.get(pointBelowUuid), {
    uuid: pointBelowUuid,
    userdata,
    linesBelow: [],
    linesAbove: [pointAboveUuid]
  })

  t.deepEqual(pos.get(pointAboveUuid), {
    uuid: pointAboveUuid,
    userdata: {},
    linesBelow: [pointBelowUuid],
    linesAbove: []
  })

})

// test("Delete Node", t => {
//   const pos = new POS

//   const pointBelowUuid = pos.addPoint()
//   const pointAboveUuid = pos.addPoint()
//   pos.addLine({ pointBelow: pointBelowUuid, pointAbove: pointAboveUuid })

//   pos.deletePoint(pointBelowUuid)

//   t.like(pos.get(pointAboveUuid), {
//     linesBelow: []
//   })

//   t.falsy(pos.get(pointBelowUuid))
// })

// test("Get All linesBelow", t => {
//   const pos = new POS

//   const linesBelow = [pos.addPoint(), pos.addPoint()]
//   const linesAbove = [pos.addPoint({ linesBelow }), pos.addPoint({ linesBelow }), pos.addPoint({ linesBelow })]
//   const leaf = pos.addPoint({ linesBelow: linesAbove })

//   t.deepEqual(pos.getAllPointsBelow(leaf), [...linesAbove, ...linesBelow])
// })

// test("Get All linesAbove", t => {
//   const pos = new POS

//   const linesBelow = [pos.addPoint(), pos.addPoint()]
//   const linesAbove = [pos.addPoint({ linesBelow }), pos.addPoint({ linesBelow }), pos.addPoint({ linesBelow })]
//   const leaf = pos.addPoint({ linesBelow: linesAbove })

//   t.deepEqual(pos.getAllPointsAbove(linesBelow[0]), [...linesAbove, leaf])
// })

// test("Try to create Loop", t => {
//   const pos = new POS

//   const pointBelowUuid = pos.addPoint()
//   const pointAboveUuid = pos.addPoint()
//   pos.addLine({ below: pointBelowUuid, above: pointAboveUuid })
//   t.throws(
//     () => pos.addLine({ below: pointAboveUuid, above: pointBelowUuid }),
//     { message: "I cannot create this relation, it will make loop!" }
//   )
// })