import { Rx } from '@cycle/core'

function noHashChangeDriver (navigate$) {
  navigate$.subscribe()
  return Rx.Observable.never()
    .startWith(global.location.hash)
}

function hashChangeDriver () {
  const hashChange$ = Rx.Observable.fromEvent(global, 'hashchange')
    .map(e => e.newUrl.split('#').slice(1).join('#'))

  return hashChange$
    .startWith(global.location.hash)
    .distinctUntilChanged()
}

export function makeHashChangeDriver () {
  const hasHashChange = 'onhashchange' in global
  return hasHashChange ? hashChangeDriver : noHashChangeDriver
}
