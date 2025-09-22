import { AvoidMechProtocol } from './avoid-mech.protocol';
import { ScanPoint } from '../interfaces/target.interface';

describe('AvoidMechProtocol', () => {
  let protocol: AvoidMechProtocol;

  beforeEach(() => {
    protocol = new AvoidMechProtocol();
  });

  it('should filter out mech enemies', () => {
    const scanPoints: ScanPoint[] = [
      {
        coordinates: { x: 0, y: 0 },
        enemies: { type: 'soldier', number: 5 },
      },
      {
        coordinates: { x: 10, y: 10 },
        enemies: { type: 'mech', number: 1 },
      },
      {
        coordinates: { x: 5, y: 5 },
        enemies: { type: 'soldier', number: 8 },
      },
    ];

    const result = protocol.apply(scanPoints);

    expect(result).toHaveLength(2);
    expect(result[0].enemies.type).toBe('soldier');
    expect(result[1].enemies.type).toBe('soldier');
  });

  it('should keep only soldier enemies', () => {
    const scanPoints: ScanPoint[] = [
      {
        coordinates: { x: 0, y: 0 },
        enemies: { type: 'soldier', number: 5 },
      },
      {
        coordinates: { x: 10, y: 10 },
        enemies: { type: 'soldier', number: 3 },
      },
    ];

    const result = protocol.apply(scanPoints);

    expect(result).toHaveLength(2);
    expect(result[0].enemies.type).toBe('soldier');
    expect(result[1].enemies.type).toBe('soldier');
  });

  it('should return empty array if all enemies are mech', () => {
    const scanPoints: ScanPoint[] = [
      {
        coordinates: { x: 0, y: 0 },
        enemies: { type: 'mech', number: 5 },
      },
      {
        coordinates: { x: 10, y: 10 },
        enemies: { type: 'mech', number: 3 },
      },
    ];

    const result = protocol.apply(scanPoints);

    expect(result).toEqual([]);
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
