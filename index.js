import { Member, events } from '@ellementul/united-events-environment'
import { POS } from './POS.js'

import changedEvent from './events/changed.js'
import createEvent from './events/create.js'

class POSMember extends Member {
  constructor() {
    super()

    this.pos = new POS

    this.onEvent(createEvent, ({ state }) => this.create(state))
    this.role = "POS"
  }

  create({ userdata, parents, children }) {
    try {
      const uuid =  this.pos.addNode({ userdata, parents, children })
      this.changed([uuid])
    } catch (err) {
      console.log(err)
    }
  }

  changed (uuids) {
    this.send(changedEvent, {
      state: uuids.map(uuid =>  this.pos.get(uuid))
    })
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