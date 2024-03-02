import test from 'ava'
import sinon from 'sinon'

import { Provider } from '@ellementul/united-events-environment'
import { POSMember } from './index.js'

import createEvent from './events/create.js'
import changedEvent from './events/changed.js'

test('constructor of Member', t => {
  const member = new POSMember
  t.truthy(member)
})

test('Create, Get and Delete Node', t => {
  const provider = new Provider
  const member = new POSMember
  member.setProvider(provider)
  
  const yourEventCallback = sinon.fake()
  provider.onEvent(changedEvent, yourEventCallback)

  provider.sendEvent(createEvent.create())
  t.truthy(yourEventCallback.calledOnce)
});