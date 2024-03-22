import { Member, events } from '@ellementul/united-events-environment'
import { POS } from './POS.js'

import createEvent from './events/create.js'
import changedEvent from './events/changed.js'
import deleteEvent from './events/delete.js'


class POSMember extends Member {
  constructor() {
    super()

    this.pos = new POS

    this.onEvent(createEvent, ({ state }) => this.create(state))
    this.onEvent(deleteEvent, ({ state }) => this.delete(state))
    this.role = "POS"
  }

  create({ userdata, linesBelow, linesAbove }) {
    try {
      const uuid =  this.pos.addPoint({ userdata, linesBelow, linesAbove })
      this.changed([uuid])
    } catch (err) {
      console.log(err)
    }
  }

  delete(uuid) {
    this.pos.deletePoint(uuid)
    this.changed([], [uuid])
  }

  changed (uuids, removedUuids = []) {
    this.send(changedEvent, {
      state: uuids.map(uuid =>  this.pos.get(uuid)),
      removed: removedUuids
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