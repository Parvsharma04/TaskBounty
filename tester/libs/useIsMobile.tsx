'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const isClient = typeof window === 'object';

export const useIsMobile = () => {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(() => isClient && window.innerWidth <= 768);

  useEffect(() => {
    if (!isClient) return; // Ensure this only runs on the client

    const handleResize = () => {
      const newIsMobile = window.innerWidth <= 768;
      setIsMobile(newIsMobile);
    };

    handleResize(); // Check on initial load
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [pathname]); // Re-run on pathname change

  return isMobile;
};
