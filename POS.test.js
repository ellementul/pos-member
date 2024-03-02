import test from 'ava'

import { POS } from './POS.js'

test("Constructor", t => {
  const pos = new POS
  t.truthy(pos)
})

test("Add and Get node", t => {
  const pos = new POS

  const testingUUid = pos.addNode()
  t.truthy(testingUUid)

  const userdata = { testingUUid }
  const parentUuid = pos.addNode({ userdata })
  t.truthy(parentUuid)

  t.deepEqual(pos.get(parentUuid), {
    uuid: parentUuid,
    userdata,
    parents: [],
    children: [],
    isEldest: true,
    isYoungest: true
  })

  const childUuid = pos.addNode({ parents: [parentUuid] })
  t.truthy(childUuid)

  t.deepEqual(pos.get(parentUuid), {
    uuid: parentUuid,
    userdata,
    parents: [],
    children: [childUuid],
    isEldest: true,
    isYoungest: false
  })

  t.deepEqual(pos.get(childUuid), {
    uuid: childUuid,
    userdata: {},
    parents: [parentUuid],
    children: [],
    isEldest: false,
    isYoungest: true
  })

})


test("Add and Delete Realtion", t => {
  const pos = new POS

  const parentUuid = pos.addNode()
  const childUuid = pos.addNode()
  pos.addRelation({ parent: parentUuid, child: childUuid })

  t.like(pos.get(parentUuid), {
    parents: [],
    children: [childUuid],
    isEldest: true,
    isYoungest: false
  })

  t.like(pos.get(childUuid), {
    parents: [parentUuid],
    children: [],
    isEldest: false,
    isYoungest: true
  })

  pos.deleteRelation({ parent: parentUuid, child: childUuid })

  t.like(pos.get(parentUuid), {
    children: [],
    isEldest: true,
    isYoungest: true
  })

  t.like(pos.get(childUuid), {
    parents: [],
    isEldest: true,
    isYoungest: true
  })

})

test("Delete Node", t => {
  const pos = new POS

  const parentUuid = pos.addNode()
  const childUuid = pos.addNode()
  pos.addRelation({ parent: parentUuid, child: childUuid })

  pos.deleteNode(parentUuid)

  t.like(pos.get(childUuid), {
    parents: [],
    isEldest: true,
    isYoungest: true
  })

  t.falsy(pos.get(parentUuid))
})