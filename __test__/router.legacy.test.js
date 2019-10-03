require('@testing-library/jest-dom/extend-expect')
const Router = require('../dist/router.dev')

// TAG: issue-15 - https://github.com/neetjn/core-routing/issues/15
describe('Router (legacy support)', () => {
    const navigate = route => {
      window.location.hash = `#!${route}`
    }

    const DEFAULT_ROUTE = '/home'
    const DEFAULT_LOCATION_EVENT = {
      path: DEFAULT_ROUTE,
      hash: `#!${DEFAULT_ROUTE}`,
      href: `http://localhost/#!${DEFAULT_ROUTE}`
    }

    const NAVIGATED_ROUTE = '/someplace'
    const NAVIGATED_LOCATION_EVENT = {
      path: NAVIGATED_ROUTE,
      hash: `#!${NAVIGATED_ROUTE}`,
      href: `http://localhost/#!${NAVIGATED_ROUTE}`
    }

    const EMPTY_ROUTE = '/'
    const NAVIGATED_EMPTY_LOCATION_EVENT = {
      path: EMPTY_ROUTE,
      hash: `#!${EMPTY_ROUTE}`,
      href: `http://localhost/#!${EMPTY_ROUTE}`
    }

    const ctx = { }

    beforeEach(() => {
      ctx.state = {
        started: {
          called: 0,
          event: null
        },
        navigated: {
          called: 0,
          event: null
        },
        stopped: {
          called: 0,
          event: null
        }
      }

      navigate(DEFAULT_ROUTE)

      // delete popstate handler in window
      // should trigger legacy fallback
      delete(window.onpopstate)

      ctx.router = new Router({
        client: {
          onStart(e) {
            ctx.state.started.called += 1
            ctx.state.started.event = e
          },
          onNavigate(e) {
            ctx.state.navigated.called += 1
            ctx.state.navigated.event = e
          },
          onStop(e) {
            ctx.state.stopped.called += 1
            ctx.state.stopped.event = e
          }
        }
      })
    })

    afterEach(() => {
      ctx.router.stop()
    })

    it('should initialize as expected', () => {
      expect(ctx.router.running).toBeFalsy()
      expect(ctx.state.started.called).toBe(0)
      expect(ctx.router.legacySupport).toBeTruthy()
    })

    it('should start as expected', () => {
      ctx.router.start()
      expect(ctx.router.running).toBeTruthy()
      expect(ctx.state.started.called).toBe(1)
      expect(ctx.state.started.event.location).toEqual(DEFAULT_LOCATION_EVENT)
    })

    it('should stop as expected', () => {
      ctx.router.start()
      expect(ctx.state.stopped.called).toBe(0)
      ctx.router.stop()
      expect(ctx.router.running).toBeFalsy()
      expect(ctx.state.stopped.called).toBe(1)
      expect(ctx.state.stopped.event.location).toEqual(DEFAULT_LOCATION_EVENT)
    })

    it('should handle navigations as expected', () => {
      expect(ctx.state.navigated.called).toBe(0)
      ctx.router.start()
      expect(ctx.state.navigated.called).toBe(0)
      navigate(NAVIGATED_ROUTE)
      // TODO: left here, resolve navigation failure
      expect(ctx.state.navigated.called).toBe(1)
      expect(ctx.state.navigated.event.previous).toEqual(DEFAULT_LOCATION_EVENT)
      expect(ctx.state.navigated.event.location).toEqual(NAVIGATED_LOCATION_EVENT)
    })

    // TAG: issue-18 - https://github.com/neetjn/core-routing/issues/18
    it('should handle empty paths as expected', () => {
      expect(ctx.state.navigated.called).toBe(0)
      ctx.router.start()
      expect(ctx.state.navigated.called).toBe(0)
      navigate(EMPTY_ROUTE)
      expect(ctx.state.navigated.called).toBe(1)
      expect(ctx.state.navigated.event.previous).toEqual(DEFAULT_LOCATION_EVENT)
      expect(ctx.state.navigated.event.location).toEqual(NAVIGATED_EMPTY_LOCATION_EVENT)
      expect(ctx.state.navigated.event.$tools.match(
        EMPTY_ROUTE,
        ctx.state.navigated.event.location.path
      )).toBeTruthy()
    })
  })
