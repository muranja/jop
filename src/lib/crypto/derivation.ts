import { WalletContractV4 } from '@ton/ton';
import { Address } from '@ton/core';

/**
 * Deterministically derives a TON V4R2 wallet address for a user.
 * 
 * @param masterPublicKey - The public key hex string from the cold master wallet.
 * @param subwalletId - A unique integer for the user (e.g., player database ID).
 * @returns The non-bounceable TON address string.
 */
export function deriveUserAddress(masterPublicKey: string, subwalletId: number): string {
  const publicKey = Buffer.from(masterPublicKey, 'hex');

  // Create wallet contract instance
  // We use walletId to derive unique addresses from the same public key
  const wallet = WalletContractV4.create({
    workchain: 0,
    publicKey: publicKey,
    walletId: subwalletId,
  });

  // Return non-bounceable address (ideal for deposits)
  return wallet.address.toString({
    bounceable: false,
    testOnly: process.env.NODE_ENV !== 'production'
  });
}

/**
 * Validates if the given string is a valid TON address.
 */
export function isValidAddress(address: string): boolean {
  try {
    Address.parse(address);
    return true;
  } catch {
    return false;
  }
}
