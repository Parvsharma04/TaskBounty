"use client";
import { useEffect, useState } from 'react';

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      // Check if window is defined to avoid ReferenceError during SSR
      if (typeof window !== 'undefined') {
        const isMobileView = window.innerWidth <= 768; // Adjust this breakpoint as needed
        setIsMobile(isMobileView);
        console.log('Window width:', window.innerWidth, 'Is mobile:', isMobileView);
      }
    };

    handleResize(); // Check on initial render
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile; // Corrected return value
};
