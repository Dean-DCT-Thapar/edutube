'use client';

import { useEffect } from 'react';

export default function ConsoleSuppressionWrapper({ children }) {
  useEffect(() => {
    // Console suppression is handled by inline script in layout.js
    // This component is kept for structure but actual suppression happens server-side
  }, []);

  return children;
}
