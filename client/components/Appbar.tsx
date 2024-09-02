'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

const NavBar = () => {
  const wallet = useWallet();
  return (
    <div className='flex justify-between p-4 border bg-gray-300'>
      <div className='flex items-center space-x-4'>
        <h3 className='font-serif'>TaskBounty</h3>
      </div>
      <div>
        <WalletMultiButtonDynamic>
          {wallet.publicKey
            ? `${wallet.publicKey.toBase58().substring(0, 7)}...`
            : 'Connect Wallet'}
        </WalletMultiButtonDynamic>
      </div>
    </div>
  );
};

export default NavBar;
