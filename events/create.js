import { EventFactory, Types } from '@ellementul/united-events-environment'

const nodeType = Types.Object.Def({
  children: [],
  parents: []
}, true)

const type = Types.Object.Def({
  system: "POS",
  action: "Create",
  entity: "Node",
  state: nodeType
})

export default EventFactory(type)