import { Rx } from '@cycle/core'

function noHashChangeDriver (navigate$) {
  navigate$.subscribe()
  return Rx.Observable.never()
    .startWith(global.location.hash)
}

function hashChangeDriver (navigate$) {
  const hashChange$ = Rx.Observable.fromEvent(global, 'hashchange')
    .map(e => e.newUrl)

  navigate$
    .subscribe(hash => {
      global.location.hash = hash
    })

  return hashChange$
    .startWith(global.location.hash)
    .distinctUntilChanged()
}

export function makeHashChangeDriver () {
  const hasHashChange = 'onhashchange' in global
  return hasHashChange ? hashChangeDriver : noHashChangeDriver
}
