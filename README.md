# core-routing

[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fneetjn%2Fcore-routing%2Fbadge&style=flat)](https://actions-badge.atrox.dev/neetjn/core-routing/goto)
[![codecov](https://codecov.io/gh/neetjn/core-routing/branch/master/graph/badge.svg)](https://codecov.io/gh/neetjn/core-routing)
[![npm version](https://badge.fury.io/js/core-routing.svg)](https://badge.fury.io/js/core-routing)

[![NPM](https://nodei.co/npm/core-routing.png)](https://nodei.co/npm/core-routing/)

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Framework agnostic interface for client sided routing using the HTML5 history api.

### Support

> Support is available for older browsers without the HTML 5 history api, however events may be dispatched irregularly and all features may not be available.

| Chome  | Edge | Firefox | Opera    | Safari |
|--------|------|---------|----------|--------|
| 5.0+ ✔ |  ✔   | 4.0+ ✔  | 11.50+ ✔ | 5.0+ ✔ |

### About

> This project is still in it's infancy phase, and there is no single specification for the client api.

This project was created in wake of a redesign of the [riot-view-router](https://github.com/neetjn/riot-view-router) project. It was designed from the ground up to be a reliable, speedy, framework agnostic interface for client sided routing using the HTML 5 history api. This framework aims not to define a paradigm from which developers can flesh out framework specific routers, but to provide an interface to help make the process much simpler and more streamline.

## Install

To install via NPM:
```sh
npm install core-routing
```
For a quick start using jsdelivr:
```html
<script src="https://cdn.jsdelivr.net/npm/core-routing/dist/core-routing.prod.js"></script>
```

### Use

The router at it's core is quite simple to use. The bundle exposes a UMD module that can be imported with CommonJS:

```js
const Router = require('core-routing');
```

or ES6

```js
import Router from 'core-routing'
```

When referencing from a browser, a global definition `Router` will be exposed:

```html
<script src="https://cdn.jsdelivr.net/npm/core-routing/dist/core-routing.prod.js"></script>
<script>
  const router = new Router(...);
</script>
```

The constructor takes an object in the form:

```js
{
  client?: {
    onStart?: => (e) { },
    onNavigate?: => (e) { },
    onStop?: (e) => { }
  },
  config?: {
    ...
  }
}
```

Event details/structure can be seen [here](https://github.com/neetjn/core-routing/blob/master/src/interfaces/event.d.ts).

### Example

```html
<h1>Route: <span id="context"></span></h1>
<h1>Details: <span id="details"></span></h1>
<script>
  window.onload = e => {
    const context = document.querySelector("#context");
    const details = document.querySelector("#details");
    
    const routes = [
      {
        path: "/",
        name: "home"
      },
      {
        path: "/user/:userId/profile",
        name: "user-profile"
      },
      {
        path: "*",
        name: "not-found"
      }
    ];

    const matchRoute = e => {
      // match defined routes w/ current location
      const route = routes.find(r => e.$tools.match(e.location.path, r.path));
      if (route) {
        // when route matched
        context.innerText = route.name;
        const routeDetails = e.$tools.process(e.location.path, route.path);
        details.innerText = JSON.stringify(routeDetails);
      } else {
        // when no route matched
        context.innerText = "{ PLEASE DEFINE A FALLBACK ROUTE }";
        details.innerText = "{ }";
      }
    };

    const router = new Router({
      client: {
        onStart(event) {
          console.log('Started');
          // process route on start
          matchRoute(event);
        },
        onNavigate(event) {
          console.log('Navigated!');
          // process route on navigation
          matchRoute(event);
        },
        onStop(event) {
          console.log('Stopped!');
        }
      }
    });

    const navigateEvent = (e) => {
      console.log('Navigate Event Handler Called!');
      // remove defined event handler from router
      router.off(navigateEvent);
    };

    // run event handler a single time
    router.once('navigate', navigateEvent);
    // dynamically specify event handler
    router.on('start', (e) => {
      console.log('Start Event Handler Called!');
    });

    // start router
    router.start();
  };
</script>
```

## Development

This project uses [prettier]() for code styling and leverages [tslint]() and [jslint]() to ensure consistency. For testing, we use [Jest]() with [jest-dom](). Refer to the following npm commands to simplify your development workflow:

* **lint** - Lint core project and tests.
* **pretty** - Use prettier to clean/format core project (using prettier-tslint to abide by our tslint rules).
* **bundle:prod** - Bundle the project for production (output to `dist/router.prod.js`).
* **bundle:dev** - Bundle the project for development (output to `dist/router.dev.js`).
* **bundle** - Bundle the project for both development and production.
* **test** - Run test suite.
* **build** - Lint, bundle, and test the project.

As a general rule of thumb, please reach out to lead maintainers before adding any new jslint or tslint rules.

## Contributors

* **John Nolette** (john@neetgroup.net)

Contributing guidelines are as follows,

* Any new features or bug fixes must include either a test.
  * Branches for bugs and features should be structured like so, `issue-x-username`.
* Before putting in a pull request, be sure to verify you've built all your changes and your code adheres to the defined TS and JS style rules.
  * Use `npm run lint` to lint your code and `npm run pretty` to format.
* Include your name and email in the contributors list.

---

Copyright (c) 2019 John Nolette Licensed under the MIT license.
