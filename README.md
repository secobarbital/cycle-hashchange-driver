
# Cycle hashchange Driver

A [Cycle.js](http://cycle.js.org) [driver](http://cycle.js.org/drivers.html) for the [```hashchange``` event](https://developer.mozilla.org/en-US/docs/Web/Events/hashchange).

## Design Choices

This is a very minimal ```Cycle.js``` sink driver that simply isolates ```hashchange``` events. It is meant to drive routing with another library like ```switch-path``` or ```wayfarer```.

## API

### ```makeHashChangeDriver ()```

Returns a driver that takes no input and outputs hashes from ```hashchange``` events, starting with the current hash.

## Install

```sh
npm install cycle-hashchange-driver
```

## Usage

Basics:

```js
import Cycle from '@cycle/core'
import { makeHashChangeDriver } from 'cycle-hashchange-driver'

function main (responses) {
  // ...
}

const drivers = {
  Path: makeHashChangeDriver()
}

Cycle.run(main, drivers)
```

Simple use case:

```js
function main({ DOM, Path }) {
  let localLinkClick$ = DOM.select('a').events('click')
    .filter(e => e.currentTarget.host === location.host)

  let navigate$ = localLinkClick$
    .map(e => e.currentTarget.href)

  let vtree$ = Path
    .map(url => {
      switch(url) {
        case '/':
          renderHome()
          break
        case '/user':
          renderUser()
          break
        default:
          render404()
          break
      }
    })

  return {
    DOM: vtree$,
    Path: navigate$,
    preventDefault: localLinkClick$
  };
}
```
