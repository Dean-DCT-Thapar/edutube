'use client';

import { useEffect } from 'react';

export default function ConsoleSuppressionWrapper({ children }) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      const noop = () => {};
      window.console = {
        ...window.console,
        log: noop,
        error: noop,
        warn: noop,
        info: noop,
        debug: noop,
      };
    }
  }, []);

  return children;
}
