import dynamic from 'next/dynamic';

// Dynamically import NextTask with SSR disabled
const NextTask = dynamic(() => import('../../components/NextTask'), { ssr: false });

const Bounty = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex justify-center items-center">
      <div className="w-full">
        <NextTask />
      </div>
    </div>
  );
};

export default Bounty;
