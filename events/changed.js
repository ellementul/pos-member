import { EventFactory, Types } from '@ellementul/united-events-environment'

const uuidsListType = Types.Array.Def(Types.UUID.Def(), 1024, true)

const nodeType = Types.Object.Def({
  uuid: Types.UUID.Def(),
  children: uuidsListType,
  parents: uuidsListType,
  userdata: Types.Object.Def({}, true)
})

const type = Types.Object.Def({
  system: "POS",
  entity: "Changed Nodes",
  state: Types.Array.Def(nodeType, 1024, true),
  removed: uuidsListType
})

export default EventFactory(type)