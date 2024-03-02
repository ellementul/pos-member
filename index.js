import { Member, events } from '@ellementul/united-events-environment'
const { openEvent } = events

import showEvent from './events/changed.js'
class POSMember extends Member {
  constructor() {
    super()

    this.onEvent(openEvent, () => this.show())
    this.role = "POS"
  }

  show () {
    this.send(showEvent, {
      state: {}
    })
  }
}

const exportEvents = { show: showEvent }

export {
  POSMember,
  exportEvents as events
}