import { EventFactory, Types } from '@ellementul/united-events-environment'
import pointType from './types/index.js'

const type = Types.Object.Def({
  system: "POS",
  action: "Create",
  entity: "Point",
  state: pointType
})

export default EventFactory(type)