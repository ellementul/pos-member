import test from 'ava'
import sinon from 'sinon'

import { Provider } from '@ellementul/united-events-environment'
import { POSMember } from './index.js'

import showEvent from './events/changed.js'

test('constructor of Member', t => {
  const member = new POSMember
  t.truthy(member)
})

// test('trigger event of YourMember', t => {

//   // Member connect to test provider
//   const provider = new Provider
//   const yourMember = new YourMember
//   yourMember.setProvider(provider)

//   // Subscribe to testing event
  
//   const yourEventCallback = sinon.fake()
//   provider.onEvent(yourEvent, yourEventCallback)

//   // Run the event to has to run the testing event
//   provider.sendEvent(outsideEvent.create())

//   // Check calling of the testing event
//   t.truthy(yourEventCallback.calledOnce);
// });