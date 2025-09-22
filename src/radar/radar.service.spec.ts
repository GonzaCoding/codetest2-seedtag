import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RadarService } from './radar.service';
import { ScanPoint } from './interfaces/target.interface';
import { PROTOCOLS } from './protocols';

// Mock the protocols
jest.mock('./protocols', () => ({
  PROTOCOLS: new Map([
    ['closest-enemies', {
      name: 'closest-enemies',
      apply: jest.fn((points) => points.sort((a, b) => {
        const distA = Math.sqrt(a.coordinates.x ** 2 + a.coordinates.y ** 2);
        const distB = Math.sqrt(b.coordinates.x ** 2 + b.coordinates.y ** 2);
        return distA - distB;
      }))
    }],
    ['prioritize-mech', {
      name: 'prioritize-mech',
      apply: jest.fn((points) => {
        const mechPoints = points.filter(p => p.enemies.type === 'mech');
        const otherPoints = points.filter(p => p.enemies.type !== 'mech');
        return mechPoints.length > 0 ? [...mechPoints, ...otherPoints] : points;
      })
    }],
    ['avoid-mech', {
      name: 'avoid-mech',
      apply: jest.fn((points) => points.filter(p => p.enemies.type !== 'mech'))
    }]
  ])
}));

describe('RadarService', () => {
  let service: RadarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RadarService],
    }).compile();

    service = module.get<RadarService>(RadarService);
  });

  describe('preFilterByDistance', () => {
    it('should filter out points beyond 100m range', () => {
      const scanPoints: ScanPoint[] = [
        {
          coordinates: { x: 0, y: 0 },
          enemies: { type: 'soldier', number: 5 },
        },
        {
          coordinates: { x: 0, y: 100 },
          enemies: { type: 'soldier', number: 3 },
        },
        {
          coordinates: { x: 0, y: 150 },
          enemies: { type: 'soldier', number: 8 },
        },
      ];

      const result = service.preFilterByDistance(scanPoints);

      expect(result).toHaveLength(2);
      expect(result[0].coordinates).toEqual({ x: 0, y: 0 });
      expect(result[1].coordinates).toEqual({ x: 0, y: 100 });
    });

    it('should include points at exactly 100m', () => {
      const scanPoints: ScanPoint[] = [
        {
          coordinates: { x: 0, y: 100 },
          enemies: { type: 'soldier', number: 5 },
        },
        {
          coordinates: { x: 100, y: 0 },
          enemies: { type: 'soldier', number: 3 },
        },
      ];

      const result = service.preFilterByDistance(scanPoints);

      expect(result).toHaveLength(2);
    });

    it('should handle empty array', () => {
      const result = service.preFilterByDistance([]);
      expect(result).toEqual([]);
    });

    it('should handle points at origin', () => {
      const scanPoints: ScanPoint[] = [
        {
          coordinates: { x: 0, y: 0 },
          enemies: { type: 'soldier', number: 5 },
        },
      ];

      const result = service.preFilterByDistance(scanPoints);

      expect(result).toHaveLength(1);
      expect(result[0].coordinates).toEqual({ x: 0, y: 0 });
    });
  });

  describe('applyProtocols', () => {
    it('should apply single protocol', () => {
      const scanPoints: ScanPoint[] = [
        {
          coordinates: { x: 10, y: 10 },
          enemies: { type: 'soldier', number: 5 },
        },
        {
          coordinates: { x: 0, y: 0 },
          enemies: { type: 'soldier', number: 3 },
        },
      ];

      const result = service.applyProtocols(scanPoints, ['closest-enemies']);

      expect(PROTOCOLS.get('closest-enemies')?.apply).toHaveBeenCalled();
      expect(result[0].coordinates).toEqual({ x: 0, y: 0 }); // Closest first
    });

    it('should apply multiple protocols sequentially', () => {
      const scanPoints: ScanPoint[] = [
        {
          coordinates: { x: 0, y: 0 },
          enemies: { type: 'soldier', number: 10 },
        },
        {
          coordinates: { x: 0, y: 0 },
          enemies: { type: 'mech', number: 1 },
        },
      ];

      const result = service.applyProtocols(scanPoints, ['prioritize-mech', 'closest-enemies']);

      expect(PROTOCOLS.get('prioritize-mech')?.apply).toHaveBeenCalledWith(scanPoints);
      expect(PROTOCOLS.get('closest-enemies')?.apply).toHaveBeenCalled();
      expect(result[0].enemies.type).toBe('mech');
    });

    it('should handle unknown protocol gracefully', () => {
      const scanPoints: ScanPoint[] = [
        {
          coordinates: { x: 0, y: 0 },
          enemies: { type: 'soldier', number: 5 },
        },
      ];

      const result = service.applyProtocols(scanPoints, ['unknown-protocol']);

      expect(result).toEqual(scanPoints);
    });

    it('should handle empty protocol list', () => {
      const scanPoints: ScanPoint[] = [
        {
          coordinates: { x: 0, y: 0 },
          enemies: { type: 'soldier', number: 5 },
        },
      ];

      const result = service.applyProtocols(scanPoints, []);

      expect(result).toEqual(scanPoints);
    });

    it('should handle empty scan points', () => {
      const result = service.applyProtocols([], ['closest-enemies']);

      expect(result).toEqual([]);
    });
  });

  describe('applyTieBreaker', () => {
    it('should throw NotFoundException for empty array', () => {
      expect(() => service.applyTieBreaker([])).toThrow(NotFoundException);
      expect(() => service.applyTieBreaker([])).toThrow('No target found');
    });

    it('should return single point without sorting', () => {
      const scanPoints: ScanPoint[] = [
        {
          coordinates: { x: 10, y: 10 },
          enemies: { type: 'soldier', number: 5 },
        },
      ];

      const result = service.applyTieBreaker(scanPoints);

      expect(result).toEqual(scanPoints[0]);
    });

    it('should prioritize higher enemy count', () => {
      const scanPoints: ScanPoint[] = [
        {
          coordinates: { x: 0, y: 0 },
          enemies: { type: 'soldier', number: 5 },
        },
        {
          coordinates: { x: 0, y: 0 },
          enemies: { type: 'soldier', number: 10 },
        },
      ];

      const result = service.applyTieBreaker(scanPoints);

      expect(result.enemies.number).toBe(10);
    });

    it('should prioritize mech over soldier when enemy count is equal', () => {
      const scanPoints: ScanPoint[] = [
        {
          coordinates: { x: 0, y: 0 },
          enemies: { type: 'soldier', number: 10 },
        },
        {
          coordinates: { x: 0, y: 0 },
          enemies: { type: 'mech', number: 10 },
        },
      ];

      const result = service.applyTieBreaker(scanPoints);

      expect(result.enemies.type).toBe('mech');
    });

    it('should prioritize lower x coordinate when type and count are equal', () => {
      const scanPoints: ScanPoint[] = [
        {
          coordinates: { x: 1, y: 0 },
          enemies: { type: 'soldier', number: 10 },
        },
        {
          coordinates: { x: 0, y: 0 },
          enemies: { type: 'soldier', number: 10 },
        },
      ];

      const result = service.applyTieBreaker(scanPoints);

      expect(result.coordinates.x).toBe(0);
    });

    it('should prioritize lower y coordinate when all else is equal', () => {
      const scanPoints: ScanPoint[] = [
        {
          coordinates: { x: 0, y: 1 },
          enemies: { type: 'soldier', number: 10 },
        },
        {
          coordinates: { x: 0, y: 0 },
          enemies: { type: 'soldier', number: 10 },
        },
      ];

      const result = service.applyTieBreaker(scanPoints);

      expect(result.coordinates.y).toBe(0);
    });

    it('should handle complex tie-breaking scenario', () => {
      const scanPoints: ScanPoint[] = [
        {
          coordinates: { x: 1, y: 1 },
          enemies: { type: 'soldier', number: 5 },
        },
        {
          coordinates: { x: 0, y: 1 },
          enemies: { type: 'mech', number: 5 },
        },
        {
          coordinates: { x: 0, y: 0 },
          enemies: { type: 'mech', number: 5 },
        },
      ];

      const result = service.applyTieBreaker(scanPoints);

      // Should select mech with lowest coordinates
      expect(result.enemies.type).toBe('mech');
      expect(result.coordinates).toEqual({ x: 0, y: 0 });
    });
  });
});
