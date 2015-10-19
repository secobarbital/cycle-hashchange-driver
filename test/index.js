import test from 'tape'
import sinon from 'sinon'
import { Rx } from '@cycle/core'
import { makePushStateDriver, makeHashChangeDriver } from '../src'

function setupListeners () {
  global.eventListeners = []
  global.addEventListener = (key, listener) => {
    global.eventListeners[key] = global.eventListeners[key] || []
    global.eventListeners[key].push(listener)
  }
  global.removeEventListener = sinon.spy()
}

function saveOriginals () {
  return {
    location: global.location,
    addEventListener: global.addEventListener,
    removeEventListener: global.removeEventListener,
    eventListeners: global.eventListeners,
    onhashchange: global.onhashchange
  }
}

function setupHashChange () {
  const originals = saveOriginals()
  global.onhashchange = sinon.spy()
  global.location = {
    hash: '#current'
  }
  setupListeners()
  return originals
}

function teardown (originals) {
  [
    'location',
    'addEventListener',
    'removeEventListener',
    'eventListeners',
    'onhashchange'
  ].forEach(key => {
    if (originals[key]) {
      global[key] = originals[key]
    } else {
      delete global[key]
    }
  })
}

test('makeHashChangeDriver should return a function', t => {
  const originals = setupHashChange()
  const driver = makeHashChangeDriver()
  t.equal(typeof driver, 'function')
  teardown(originals)
  t.end()
})

test('makeHashChangeDriver should return fallback if onhashchange is not available', t => {
  const driver = makeHashChangeDriver()
  t.equal(typeof driver, 'function')
  t.equal(driver.name, 'noHashChangeDriver')
  t.end()
})

test('makeHashChangeDriver should return hashChangeDriver if onhashchange is available', t => {
  const originals = setupHashChange()
  const driver = makeHashChangeDriver()
  t.equal(typeof driver, 'function')
  t.equal(driver.name, 'hashChangeDriver')
  teardown(originals)
  t.end()
})

test('hashChangeDriver should respond to hashchange', t => {
  const originals = setupHashChange()
  const driver = makeHashChangeDriver()
  const output = []
  driver()
    .take(2)
    .subscribe(
      url => output.push(url),
      t.error,
      () => {
        t.deepEqual(
          output, ['current', 'home'],
          'should emit on hashchange only when it is different from previous')
      }
    )
  t.equal(global.eventListeners.hashchange.length, 1, 'should be listening to hashchange')
  const hashchangeListener = global.eventListeners.hashchange[0]
  hashchangeListener({ newURL: 'http://www.test/app#home', oldURL: 'http://www.test/app#current' })
  teardown(originals)
  t.end()
})
