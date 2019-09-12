# core-routing

[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fneetjn%2Fcore-routing%2Fbadge&style=flat)](https://actions-badge.atrox.dev/neetjn/core-routing/goto)
[![codecov](https://codecov.io/gh/neetjn/core-routing/branch/master/graph/badge.svg)](https://codecov.io/gh/neetjn/core-routing)
[![npm version](https://badge.fury.io/js/core-routing.svg)](https://badge.fury.io/js/core-routing)

[![NPM](https://nodei.co/npm/core-routing.png)](https://nodei.co/npm/core-routing/)

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Framework agnostic interface for client sided routing using the HTML5 history api.

## Why

This project was created ...

## About

TBD

## Configuration

TBD

## Use

TBD

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

    // start router
    router.start();
  };
</script>
```

## Install

TBD

## Development

TBD

## Contributing

TBD

---

Copyright (c) 2019 John Nolette Licensed under the MIT license.
