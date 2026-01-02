import { useState, useEffect } from 'react';

/**
 * Custom Hook to detect screen size changes (Responsive Logic in JS)
 * Usage: const isMobile = useMediaQuery('(max-width: 768px)');
 */
export function useMediaQuery(query) {
  // 1. Initialize state with the current match status
  // This prevents a "flash" of wrong content on initial load
  const [matches, setMatches] = useState(() => {
    // Check if window exists (Safety for all environments)
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 2. Create the media query list
    const media = window.matchMedia(query);

    // 3. Define the listener to update state
    const listener = (event) => setMatches(event.matches);

    // 4. Add the listener
    media.addEventListener('change', listener);
    
    // Ensure state is in sync immediately
    setMatches(media.matches);

    // 5. Cleanup listener on unmount
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}