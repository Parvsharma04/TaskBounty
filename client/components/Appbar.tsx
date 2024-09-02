'use client';

import { BACKEND_URL } from '@/utils';
import { useWallet } from '@solana/wallet-adapter-react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';

const WalletMultiButtonDynamic = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  { ssr: false }
);

const NavBar = () => {
  const { publicKey, disconnect, signMessage } = useWallet();

  useEffect(() => {
    async function getToken() {
      try {
        if(!publicKey)
          return;
        const message = new TextEncoder().encode('verify this to authenticate')
        const signature = await signMessage?.(message)
        let response = await axios.post(`${BACKEND_URL}/v1/user/signin`,
          {signature, publicKey:publicKey?.toString()}
        );
        localStorage.setItem("token", response.data.token);

      } catch (error) {
        console.error('Error fetching token:', error);
      }
    }

    if (publicKey) {
      getToken();
    }
  }, [publicKey]);

  useEffect(() => {
    if (!publicKey) {
      localStorage.removeItem("token");
    }
  }, [publicKey]);

  return (
    <div className='flex justify-between p-4 border bg-gray-300'>
      <div className='flex items-center space-x-4'>
        <h3 className='font-serif'>TaskBounty</h3>
      </div>
      <div>
        <WalletMultiButtonDynamic>
          {publicKey
            ? `${publicKey.toBase58().substring(0, 7)}...`
            : 'Connect Wallet'}
        </WalletMultiButtonDynamic>
      </div>
    </div>
  );
};

export default NavBar;
