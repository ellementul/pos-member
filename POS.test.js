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
    roots: [],
    leaves: [],
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
    linesAbove: [pointAboveUuid],
    leaves: [pointAboveUuid]
  })

  t.like(pos.get(pointAboveUuid), {
    linesBelow: [pointBelowUuid],
    linesAbove: [],
    roots: [pointBelowUuid]
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

  const userdata = { testing: "Data" }
  const leaves = [ pos.addPoint({ userdata }), pos.addPoint({ userdata }) ]
  const roots = [ pos.addPoint({ userdata }), pos.addPoint({ userdata }) ]
  const middlePoints = [ pos.addPoint({ userdata, linesAbove: leaves, linesBelow: roots }), pos.addPoint({ userdata, linesAbove: leaves, linesBelow: roots }) ]
  

  t.deepEqual(pos.get(middlePoints[0]), {
    uuid: middlePoints[0],
    userdata,
    linesBelow: roots,
    linesAbove: leaves,
    leaves,
    roots
  })
})

test("Delete Node", t => {
  const pos = new POS

  const pointBelowUuid = pos.addPoint()
  const pointAboveUuid = pos.addPoint()
  pos.addLine({ below: pointBelowUuid, above: pointAboveUuid })

  pos.deletePoint(pointBelowUuid)

  t.like(pos.get(pointAboveUuid), {
    linesBelow: []
  })

  t.falsy(pos.get(pointBelowUuid))
})

test("Try to create Loop", t => {
  const pos = new POS

  const pointBelowUuid = pos.addPoint()
  const pointAboveUuid = pos.addPoint()
  pos.addLine({ below: pointBelowUuid, above: pointAboveUuid })
  t.throws(
    () => pos.addLine({ below: pointAboveUuid, above: pointBelowUuid }),
    { message: `I cannot create this line: ` + JSON.stringify({ below: pointAboveUuid, above: pointBelowUuid }) + `it will make loop!` }
  )
})