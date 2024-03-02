import { Types } from '@ellementul/united-events-environment'
const randomUUID = Types.UUID.Def().rand

export class POS {
  constructor () {
    this.nodes = new Map
    this.eldestes = new Set
    this.youngestes = new Set
  }

  get (uuid) {
    if(!this.nodes.has(uuid))
      return null

    const { userdata, parents, children } = this.nodes.get(uuid)
    return {
      uuid,
      userdata,
      parents: Array.from(parents),
      children: Array.from(children),
      isEldest: this.eldestes.has(uuid),
      isYoungest: this.youngestes.has(uuid)
    }
  }

  addNode({ userdata = {}, parents = [], children = [] } = {}) {
    const uuid = randomUUID()

    this.nodes.set(uuid, {
      uuid,
      userdata,
      parents: new Set(),
      children: new Set()
    })

    for (const parent of parents)
      this.addRelation({ parent, child: uuid })

    for (const child of children)
      this.addRelation({ parent: uuid, child })

    if(this.nodes.get(uuid).parents.size === 0)
      this.eldestes.add(uuid)

    if(this.nodes.get(uuid).children.size === 0)
      this.youngestes.add(uuid)

    return uuid
  }

  deleteNode(uuid) {
    const node = this.nodes.get(uuid)

    for (const parent of node.parents)
      this.deleteRelation({ parent, child: uuid })

    for (const child of node.children)
      this.deleteRelation({ parent: uuid, child })

    this.nodes.delete(uuid)
  }

  addRelation ({ parent, child }) {
    const parentNode = this.nodes.get(parent)
    const childNode = this.nodes.get(child)

    this.addParent(childNode, parent)
    this.addChild(parentNode, child)
  }

  addParent(node, parent) {
    if(!this.nodes.has(parent))
      throw new Error(`Parent node with ${parent} uuid has to be in POS!`)

    node.parents.add(parent)
    this.eldestes.delete(node.uuid)
  }

  addChild(node, child) {
    if(!this.nodes.has(child))
      throw new Error(`Child node with ${child} uuid has to be in POS!`)

    node.children.add(child)
    this.youngestes.delete(node.uuid)
  }

  deleteRelation ({ parent, child }) {
    const parentNode = this.nodes.get(parent)
    const childNode = this.nodes.get(child)

    this.deleteParent(childNode, parent)
    this.deleteChild(parentNode, child)
  }

  deleteParent(node, parent) {
    node.parents.delete(parent)

    if(node.parents.size == 0)
      this.eldestes.add(node.uuid)
  }

  deleteChild(node, child) {
    node.children.delete(child)

    if(node.children.size == 0)
      this.youngestes.add(node.uuid)
  }
}