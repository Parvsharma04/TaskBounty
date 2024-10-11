import dynamic from 'next/dynamic';

// Dynamically import the LandingPage component with SSR disabled
const LandingPage = dynamic(() => import('@/components/Home'), { ssr: false });

export default function Home() {
  return <LandingPage />;
}
