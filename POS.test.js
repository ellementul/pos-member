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
    children: []
  })

  const childUuid = pos.addNode({ parents: [parentUuid] })
  t.truthy(childUuid)

  t.deepEqual(pos.get(parentUuid), {
    uuid: parentUuid,
    userdata,
    parents: [],
    children: [childUuid]
  })

  t.deepEqual(pos.get(childUuid), {
    uuid: childUuid,
    userdata: {},
    parents: [parentUuid],
    children: []
  })

})


test("Add and Delete Realtion", t => {
  const pos = new POS

  const parentUuid = pos.addNode()
  const childUuid = pos.addNode()
  pos.addRelation({ parent: parentUuid, child: childUuid })

  t.like(pos.get(parentUuid), {
    parents: [],
    children: [childUuid]
  })

  t.like(pos.get(childUuid), {
    parents: [parentUuid],
    children: []
  })

  pos.deleteRelation({ parent: parentUuid, child: childUuid })

  t.like(pos.get(parentUuid), {
    children: []
  })

  t.like(pos.get(childUuid), {
    parents: []
  })

})

test("Delete Node", t => {
  const pos = new POS

  const parentUuid = pos.addNode()
  const childUuid = pos.addNode()
  pos.addRelation({ parent: parentUuid, child: childUuid })

  pos.deleteNode(parentUuid)

  t.like(pos.get(childUuid), {
    parents: []
  })

  t.falsy(pos.get(parentUuid))
})

test("Get All Parents", t => {
  const pos = new POS

  const parents = [pos.addNode(), pos.addNode()]
  const childs = [pos.addNode({ parents }), pos.addNode({ parents }), pos.addNode({ parents })]
  const youngest = pos.addNode({ parents: childs })

  t.deepEqual(pos.getAllParents(youngest), [...childs, ...parents])
})

test("Get All Children", t => {
  const pos = new POS

  const parents = [pos.addNode(), pos.addNode()]
  const childs = [pos.addNode({ parents }), pos.addNode({ parents }), pos.addNode({ parents })]
  const youngest = pos.addNode({ parents: childs })

  t.deepEqual(pos.getAllChildren(parents[0]), [...childs, youngest])
})

test("Try to create Loop", t => {
  const pos = new POS

  const parentUuid = pos.addNode()
  const childUuid = pos.addNode()
  pos.addRelation({ parent: parentUuid, child: childUuid })
  t.throws(
    () => pos.addRelation({ parent: childUuid, child: parentUuid }),
    { message: "I cannot create this relation, it will make loop!" }
  )
})