import { EventFactory, Types } from '@ellementul/united-events-environment'

const type = Types.Object.Def({
  system: "POS",
  action: "Delete",
  entity: "NodeUuid",
  state: Types.UUID.Def()
})

export default EventFactory(type)