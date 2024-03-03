import { EventFactory, Types } from '@ellementul/united-events-environment'

const uuidsListType = Types.Array.Def(Types.UUID.Def(), 1024, true)

const nodeType = Types.Object.Def({
  userdata: Types.Object.Def({}, true),
  children: uuidsListType,
  parents: uuidsListType
})

const type = Types.Object.Def({
  system: "POS",
  action: "Create",
  entity: "Node",
  state: nodeType
})

export default EventFactory(type)