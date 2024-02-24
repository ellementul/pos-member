import { Member } from '@ellementul/united-events-environment'

import outsideEvent from './events/outside_event.js'
import yourEvent from './events/your_event.js'

class YourMember extends Member {
  constructor() {
    super()

    this.onEvent(outsideEvent, () => this.callback()) // Subscribing on event
    
    this.role = "DefaultMemberRole" // The manager needs it, and manager can change it
  }

  callback () {
    this.send(yourEvent, {
      state: "NewYourStateOfYourEntity" // Fill the state property in the event
      // If we don't fill the property, this property will be random.
    })
  }
}

const exportEvents = { // Export of your events
  // outside: outsideEvent, // We don't export outside events!
  your: yourEvent
}

export {
  YourMember, // Export of your member
  exportEvents as events
}