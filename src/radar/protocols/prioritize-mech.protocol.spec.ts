import { PrioritizeMechProtocol } from './prioritize-mech.protocol';
import { ScanPoint } from '../interfaces/target.interface';

describe('PrioritizeMechProtocol', () => {
  let protocol: PrioritizeMechProtocol;

  beforeEach(() => {
    protocol = new PrioritizeMechProtocol();
  });

  it('should prioritize mech enemies over soldiers', () => {
    const scanPoints: ScanPoint[] = [
      {
        coordinates: { x: 0, y: 0 },
        enemies: { type: 'soldier', number: 10 },
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

    expect(result[0].enemies.type).toBe('mech');
    expect(result[0].coordinates).toEqual({ x: 10, y: 10 });
    expect(result[1].enemies.type).toBe('soldier');
    expect(result[2].enemies.type).toBe('soldier');
  });

  it('should return all points if no mech enemies', () => {
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

    expect(result).toEqual(scanPoints);
  });

  it('should handle multiple mech enemies', () => {
    const scanPoints: ScanPoint[] = [
      {
        coordinates: { x: 0, y: 0 },
        enemies: { type: 'soldier', number: 10 },
      },
      {
        coordinates: { x: 10, y: 10 },
        enemies: { type: 'mech', number: 1 },
      },
      {
        coordinates: { x: 5, y: 5 },
        enemies: { type: 'mech', number: 2 },
      },
    ];

    const result = protocol.apply(scanPoints);

    expect(result[0].enemies.type).toBe('mech');
    expect(result[1].enemies.type).toBe('mech');
    expect(result[2].enemies.type).toBe('soldier');
  });

  it('should handle empty array', () => {
    const result = protocol.apply([]);
    expect(result).toEqual([]);
  });

  it('should handle single point', () => {
    const scanPoints: ScanPoint[] = [
      {
        coordinates: { x: 10, y: 10 },
        enemies: { type: 'mech', number: 1 },
      },
    ];

    const result = protocol.apply(scanPoints);
    expect(result).toEqual(scanPoints);
  });
});
