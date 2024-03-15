import test from 'ava'
import sinon from 'sinon'

import { Provider } from '@ellementul/united-events-environment'
import { POSMember } from './index.js'

import createEvent from './events/create.js'
import changedEvent from './events/changed.js'
import deleteEvent from './events/delete.js'

test('constructor of Member', t => {
  const member = new POSMember
  t.truthy(member)
})

test('Create, Get and Delete Node', t => {
  const provider = new Provider
  const member = new POSMember
  member.setProvider(provider)
  
  const changedCallback = sinon.fake()
  provider.onEvent(changedEvent, changedCallback)

  //Create eldest node
  provider.sendEvent({
    ...createEvent.create(),
    state: {
      parents: [],
      children: []
    }
  })
  t.truthy(changedCallback.calledOnce)
  t.is(changedCallback.firstArg.state.length, 1)

  const parentNode = changedCallback.firstArg.state[0]
  t.deepEqual(parentNode.userdata, {})

  //Create child
  provider.sendEvent({
    ...createEvent.create(),
    state: {
      userdata: { data: "TestingData" },
      parents: [parentNode.uuid],
      children: []
    }
  })
  t.is(changedCallback.firstArg.state.length, 1)
  const childNode = changedCallback.firstArg.state[0]
  t.not(parentNode.uuid, childNode.uuid)
  t.is(parentNode.uuid, childNode.parents[0])

  t.deepEqual(childNode.userdata, { data: "TestingData" })

  //Delete eldest node
  provider.sendEvent({
    ...deleteEvent.create(),
    state: parentNode.uuid
  })
  t.is(changedCallback.firstArg.removed.length, 1)
  t.is(changedCallback.firstArg.removed[0], parentNode.uuid)
});