import { EventFactory, Types } from '@ellementul/united-events-environment'
// Defined a type of your event
const type = Types.Object.Def({
  system: "TheSystemOfYour",
  entity: "TheEntityOfYourSystem",
  state: Types.Key.Def() // Only [a-zA-Z0-9_] characters in key
}, true) // If it is true, event can content other property what we don't define in this event type  
export default EventFactory(type)