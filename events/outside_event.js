import { EventFactory, Types } from '@ellementul/united-events-environment'
// Defined a type of event what you want to listen  
const type = Types.Object.Def({
  system: "TheOutsideSystem",
  entity: "TheOutsideEntity",
  action: "Start"
})
export default EventFactory(type)