import { Types } from '@ellementul/united-events-environment'

const uuidsListType = Types.Array.Def(Types.UUID.Def(), 1024, true)

const pointType = Types.Object.Def({
  userdata: Types.Object.Def({}, true),
  pointsAbove: uuidsListType,
  pointsBelow: uuidsListType
})

export default pointType
