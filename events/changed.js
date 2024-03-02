import { EventFactory, Types } from '@ellementul/united-events-environment'

const type = Types.Object.Def({
  system: "POS",
  entity: "Changed Nodes"
}, true)

export default EventFactory(type)