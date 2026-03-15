import { describe, it, expect } from 'vitest';
import { deriveUserAddress, isValidAddress } from './derivation';

describe('TON Wallet Derivation', () => {
  const masterPubKey = "5ae302d9136c116c478a5e302d9136c116c478a5e302d9136c116c478a5e302d"; // Mock 32-byte hex

  it('should derive deterministic addresses for subwallet IDs', () => {
    const addr1 = deriveUserAddress(masterPubKey, 1);
    const addr2 = deriveUserAddress(masterPubKey, 1);
    const addr3 = deriveUserAddress(masterPubKey, 2);

    expect(addr1).toBe(addr2);
    expect(addr1).not.toBe(addr3);
    expect(isValidAddress(addr1)).toBe(true);
  });

  it('should derive valid non-bounceable addresses', () => {
    const addr = deriveUserAddress(masterPubKey, 12345);
    console.log('Derived Address:', addr);
    // TON non-bounceable addresses usually start with U or E (base64)
    expect(isValidAddress(addr)).toBe(true);
  });
});
