import { EventFactory, Types } from '@ellementul/united-events-environment'

const uuidsListType = Types.Array.Def(Types.UUID.Def(), 1024, true)

const pointType = Types.Object.Def({
  uuid: Types.UUID.Def(),
  userdata: Types.Object.Def({}, true),
  linesAbove: uuidsListType,
  linesBelow: uuidsListType,
  roots: uuidsListType,
  leaves: uuidsListType
})

const type = Types.Object.Def({
  system: "POS",
  entity: "Changed Points",
  state: Types.Array.Def(pointType, 1024, true),
  removed: uuidsListType
})

export default EventFactory(type)