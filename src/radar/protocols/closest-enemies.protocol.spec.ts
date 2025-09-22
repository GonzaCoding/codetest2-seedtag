import { ClosestEnemiesProtocol } from './closest-enemies.protocol';
import { ScanPoint } from '../interfaces/target.interface';

describe('ClosestEnemiesProtocol', () => {
  let protocol: ClosestEnemiesProtocol;

  beforeEach(() => {
    protocol = new ClosestEnemiesProtocol();
  });

  it('should prioritize closest enemies', () => {
    const scanPoints: ScanPoint[] = [
      {
        coordinates: { x: 10, y: 10 },
        enemies: { type: 'soldier', number: 5 },
      },
      {
        coordinates: { x: 0, y: 0 },
        enemies: { type: 'soldier', number: 3 },
      },
      {
        coordinates: { x: 5, y: 5 },
        enemies: { type: 'soldier', number: 8 },
      },
    ];

    const result = protocol.apply(scanPoints);

    expect(result[0].coordinates).toEqual({ x: 0, y: 0 }); // Closest to origin
    expect(result[1].coordinates).toEqual({ x: 5, y: 5 }); // Second closest
    expect(result[2].coordinates).toEqual({ x: 10, y: 10 }); // Farthest
  });

  it('should handle points at same distance', () => {
    const scanPoints: ScanPoint[] = [
      {
        coordinates: { x: 3, y: 4 },
        enemies: { type: 'soldier', number: 5 },
      },
      {
        coordinates: { x: 4, y: 3 },
        enemies: { type: 'soldier', number: 3 },
      },
    ];

    const result = protocol.apply(scanPoints);

    // Both are at distance 5, order should be preserved
    expect(result).toHaveLength(2);
  });

  it('should handle empty array', () => {
    const result = protocol.apply([]);
    expect(result).toEqual([]);
  });

  it('should handle single point', () => {
    const scanPoints: ScanPoint[] = [
      {
        coordinates: { x: 10, y: 10 },
        enemies: { type: 'soldier', number: 5 },
      },
    ];

    const result = protocol.apply(scanPoints);
    expect(result).toEqual(scanPoints);
  });
});
