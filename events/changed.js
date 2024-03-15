import { EventFactory, Types } from '@ellementul/united-events-environment'
import pointType from './types/index.js'

const uuidsListType = Types.Array.Def(Types.UUID.Def(), 1024, true)

const type = Types.Object.Def({
  system: "POS",
  entity: "Changed Points",
  state: Types.Array.Def(pointType, 1024, true),
  removed: uuidsListType
})

export default EventFactory(type)