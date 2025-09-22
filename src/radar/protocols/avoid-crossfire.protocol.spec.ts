import { AvoidCrossfireProtocol } from './avoid-crossfire.protocol';
import { ScanPoint } from '../interfaces/target.interface';

describe('AvoidCrossfireProtocol', () => {
  let protocol: AvoidCrossfireProtocol;

  beforeEach(() => {
    protocol = new AvoidCrossfireProtocol();
  });

  it('should filter out points with allies', () => {
    const scanPoints: ScanPoint[] = [
      {
        coordinates: { x: 0, y: 0 },
        enemies: { type: 'soldier', number: 5 },
      },
      {
        coordinates: { x: 10, y: 10 },
        enemies: { type: 'soldier', number: 3 },
        allies: 2,
      },
      {
        coordinates: { x: 5, y: 5 },
        enemies: { type: 'soldier', number: 8 },
      },
    ];

    const result = protocol.apply(scanPoints);

    expect(result).toHaveLength(2);
    expect(result[0].coordinates).toEqual({ x: 0, y: 0 });
    expect(result[1].coordinates).toEqual({ x: 5, y: 5 });
  });

  it('should keep points with zero allies', () => {
    const scanPoints: ScanPoint[] = [
      {
        coordinates: { x: 0, y: 0 },
        enemies: { type: 'soldier', number: 5 },
      },
      {
        coordinates: { x: 10, y: 10 },
        enemies: { type: 'soldier', number: 3 },
        allies: 0,
      },
    ];

    const result = protocol.apply(scanPoints);

    expect(result).toHaveLength(2);
    expect(result[0].coordinates).toEqual({ x: 0, y: 0 });
    expect(result[1].coordinates).toEqual({ x: 10, y: 10 });
  });

  it('should keep points without allies property', () => {
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
    expect(result[0].coordinates).toEqual({ x: 0, y: 0 });
    expect(result[1].coordinates).toEqual({ x: 10, y: 10 });
  });

  it('should return empty array if all points have allies', () => {
    const scanPoints: ScanPoint[] = [
      {
        coordinates: { x: 0, y: 0 },
        enemies: { type: 'soldier', number: 5 },
        allies: 2,
      },
      {
        coordinates: { x: 10, y: 10 },
        enemies: { type: 'soldier', number: 3 },
        allies: 1,
      },
    ];

    const result = protocol.apply(scanPoints);

    expect(result).toEqual([]);
  });

  it('should handle empty array', () => {
    const result = protocol.apply([]);
    expect(result).toEqual([]);
  });
});
