
# Cycle onhashchange Driver

A [Cycle.js](http://cycle.js.org) [driver](http://cycle.js.org/drivers.html) for the onhashchange API.

## API

### ```makeHashChangeDriver ()```

Returns a navigation driver that sets ```location.hash``` to the input hashes and outputs hashes received with ```hashchange``` events, starting with the current hash.

## Install

Only available via git for now. I will publish this module on npm once I have added tests.

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
function main(responses) {
  let localLinkClick$ = DOM.select('a').events('click')
    .filter(e => e.currentTarget.host === location.host)

  let navigate$ = localLinkClick$
    .map(e => e.currentTarget.href)

  let vtree$ = responses.Path
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
