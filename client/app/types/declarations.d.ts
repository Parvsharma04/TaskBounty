declare module "@solana-mobile/wallet-adapter-mobile" {
  import { WalletAdapter } from "@solana/wallet-adapter-base";

  export class SolanaMobileWalletAdapter extends WalletAdapter {
    constructor(config: {
      appIdentity: { name: string };
      authorizationResultCache: any;
    });
  }

  export function createDefaultAuthorizationResultCache(): any;
}
