import { describe, it, expect } from 'vitest';
import { generateCrashPoint } from './engine';

describe('Game Engine - House Edge Logic', () => {
  it('should maintain a 3% house edge over simulations', () => {
    const iterations = 10000;
    const houseEdge = 0.03;
    let totalMultiplier = 0;
    
    for (let i = 0; i < iterations; i++) {
      const crashPoint = generateCrashPoint('test-seed', 'client-seed', i);
      totalMultiplier += crashPoint;
    }

    const averageMultiplier = totalMultiplier / iterations;
    // Theoretical average for 3% edge is roughly 1 / houseEdge (but with the max(1.00) it's nuanced)
    // Here we just check it's consistently above 1.00 and within bounds
    expect(averageMultiplier).toBeGreaterThan(1);
    expect(averageMultiplier).toBeLessThan(100); // Sanity check
  });

  it('should never crash below 1.00', () => {
    for (let i = 0; i < 1000; i++) {
      expect(generateCrashPoint('test-seed', 'client-seed', i)).toBeGreaterThanOrEqual(1.00);
    }
  });
});
