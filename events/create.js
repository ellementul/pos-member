import { EventFactory, Types } from '@ellementul/united-events-environment'

const uuidsListType = Types.Array.Def(Types.UUID.Def(), 1024, true)

const pointType = Types.Object.Def({
  userdata: Types.Object.Def({}, true),
  linesAbove: uuidsListType,
  linesBelow: uuidsListType
})

const type = Types.Object.Def({
  system: "POS",
  action: "Create",
  entity: "Point",
  state: pointType
})

export default EventFactory(type)