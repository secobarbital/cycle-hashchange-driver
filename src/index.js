import { Rx } from '@cycle/core'

function normalizeHash (hash) {
  return hash.split('#').slice(1).join('#')
}

function noHashChangeDriver () {
  return Rx.Observable.just(global.location.hash)
    .map(normalizeHash)
}

function hashChangeDriver () {
  return Rx.Observable.fromEvent(global, 'hashchange')
    .pluck('newURL')
    .startWith(global.location.hash)
    .map(normalizeHash)
    .distinctUntilChanged()
}

export function makeHashChangeDriver () {
  const hasHashChange = 'onhashchange' in global
  return hasHashChange ? hashChangeDriver : noHashChangeDriver
}
