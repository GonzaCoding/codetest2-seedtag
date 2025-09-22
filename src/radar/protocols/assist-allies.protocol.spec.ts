import { AssistAlliesProtocol } from './assist-allies.protocol';
import { ScanPoint } from '../interfaces/target.interface';

describe('AssistAlliesProtocol', () => {
  let protocol: AssistAlliesProtocol;

  beforeEach(() => {
    protocol = new AssistAlliesProtocol();
  });

  it('should prioritize points with allies', () => {
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

    expect(result[0].coordinates).toEqual({ x: 10, y: 10 }); // Has allies
    expect(result[1].coordinates).toEqual({ x: 0, y: 0 }); // No allies
    expect(result[2].coordinates).toEqual({ x: 5, y: 5 }); // No allies
  });

  it('should handle multiple points with allies', () => {
    const scanPoints: ScanPoint[] = [
      {
        coordinates: { x: 0, y: 0 },
        enemies: { type: 'soldier', number: 5 },
        allies: 3,
      },
      {
        coordinates: { x: 10, y: 10 },
        enemies: { type: 'soldier', number: 3 },
        allies: 1,
      },
    ];

    const result = protocol.apply(scanPoints);

    // Both have allies, order should be preserved
    expect(result[0].coordinates).toEqual({ x: 0, y: 0 });
    expect(result[1].coordinates).toEqual({ x: 10, y: 10 });
  });

  it('should handle points with zero allies as no allies', () => {
    const scanPoints: ScanPoint[] = [
      {
        coordinates: { x: 0, y: 0 },
        enemies: { type: 'soldier', number: 5 },
        allies: 0,
      },
      {
        coordinates: { x: 10, y: 10 },
        enemies: { type: 'soldier', number: 3 },
        allies: 2,
      },
    ];

    const result = protocol.apply(scanPoints);

    expect(result[0].coordinates).toEqual({ x: 10, y: 10 }); // Has allies
    expect(result[1].coordinates).toEqual({ x: 0, y: 0 }); // Zero allies
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
        allies: 2,
      },
    ];

    const result = protocol.apply(scanPoints);
    expect(result).toEqual(scanPoints);
  });
});
