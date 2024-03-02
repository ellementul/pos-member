import { Member, events } from '@ellementul/united-events-environment'
const { openEvent } = events

import changedEvent from './events/changed.js'
import createEvent from './events/create.js'

class POSMember extends Member {
  constructor() {
    super()

    this.onEvent(createEvent, () => this.changed())
    this.role = "POS"
  }

  changed () {
    this.send(changedEvent, {})
  }
}

const exportEvents = {
  create: createEvent,
  changed: changedEvent 
}

export {
  POSMember,
  exportEvents as events
}