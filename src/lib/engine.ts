import crypto from 'crypto';

const HOUSE_EDGE = 0.03; // 3% House Edge (97% RTP)

/**
 * Generates a provably fair crash point.
 * @param serverSeed - The server's secret seed for the round.
 * @param clientSeed - The public seed (often determined by the first bettor or a block hash).
 * @param nonce - The round number.
 * @returns The crash point multiplier (e.g., 1.00, 2.34, 100.50).
 */
export function generateCrashPoint(serverSeed: string, clientSeed: string, nonce: number): number {
  // 1. Create the HMAC-SHA256 hash
  const hash = crypto
    .createHmac('sha256', serverSeed)
    .update(`${clientSeed}-${nonce}`)
    .digest('hex');

  // 2. Extract the first 52 bits (13 hex characters)
  const hex52 = hash.slice(0, 13);
  const parsedFloat = parseInt(hex52, 16);
  
  // 3. Convert to a float between 0 and 1
  const max52Bit = Math.pow(2, 52); 
  const h = parsedFloat / max52Bit;

  // 4. Calculate the crash point based on the 3% house edge
  const crashPoint = (1 - HOUSE_EDGE) / (1 - h);

  // 5. Floor to 2 decimal places and ensure minimum crash is 1.00
  const finalMultiplier = Math.floor(crashPoint * 100) / 100;
  
  return Math.max(1.00, finalMultiplier);
}
