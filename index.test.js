import test from 'ava'
import sinon from 'sinon'

import { Provider } from '@ellementul/united-events-environment'
import { YourMember } from './index.js'

import yourEvent from './events/your_event.js'
import outsideEvent from './events/outside_event.js'

test('constructor of YourMember', t => {
  const yourMember = new YourMember
  t.truthy(yourMember)
})

test('trigger event of YourMember', t => {

  // Member connect to test provider
  const provider = new Provider
  const yourMember = new YourMember
  yourMember.setProvider(provider)

  // Subscribe to testing event
  
  const yourEventCallback = sinon.fake()
  provider.onEvent(yourEvent, yourEventCallback)

  // Run the event to has to run the testing event
  provider.sendEvent(outsideEvent.create())

  // Check calling of the testing event
  t.truthy(yourEventCallback.calledOnce);
});