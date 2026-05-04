/**
 * Console suppression utility for client-side
 * Disables console output in production mode
 */

export function suppressConsoleInProduction() {
  if (process.env.NODE_ENV === 'production') {
    const noop = () => {};
    global.console = {
      ...console,
      log: noop,
      error: noop,
      warn: noop,
      info: noop,
      debug: noop,
    };
  }
}
