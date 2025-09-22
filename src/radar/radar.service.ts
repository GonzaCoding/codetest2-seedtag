import { Injectable, NotFoundException } from '@nestjs/common';
import { ScanPoint } from './interfaces/target.interface';
import { withinRange } from './utils/distance.util';
import { PROTOCOLS } from './protocols';

@Injectable()
export class RadarService {
  /**
   * Pre-filter scan points by distance before applying protocols
   * @param scanPoints Array of scan points to filter
   * @returns Filtered scan points within 100m range
   */
  preFilterByDistance(scanPoints: ScanPoint[]): ScanPoint[] {
    return scanPoints.filter(withinRange);
  }

  /**
   * Apply protocols sequentially to scan points
   * @param scanPoints Array of scan points to process
   * @param protocolNames Array of protocol names to apply
   * @returns Processed scan points after applying all protocols
   */
  applyProtocols(
    scanPoints: ScanPoint[],
    protocolNames: string[],
  ): ScanPoint[] {
    let candidates = [...scanPoints];

    // Apply each protocol sequentially
    for (const protocolName of protocolNames) {
      const protocol = PROTOCOLS.get(protocolName);
      if (protocol) {
        candidates = protocol.apply(candidates);
      }
    }

    return candidates;
  }

  /**
   * Apply tie-breaker logic to select the final target
   * Tie-breaker order: enemies.number desc, mech>soldier, x asc, y asc
   * @param scanPoints Array of scan points to apply tie-breaker to
   * @returns The selected target point
   * @throws NotFoundException if no candidates remain
   */
  applyTieBreaker(scanPoints: ScanPoint[]): ScanPoint {
    if (scanPoints.length === 0) {
      throw new NotFoundException('No target found');
    }

    if (scanPoints.length === 1) {
      return scanPoints[0];
    }

    // Sort using tie-breaker logic
    const sorted = scanPoints.sort((a, b) => {
      // 1. enemies.number desc (higher number first)
      if (a.enemies.number !== b.enemies.number) {
        return b.enemies.number - a.enemies.number;
      }

      // 2. mech > soldier (mech enemies prioritized)
      if (a.enemies.type !== b.enemies.type) {
        if (a.enemies.type === 'mech') return -1;
        if (b.enemies.type === 'mech') return 1;
      }

      // 3. x asc (lower x coordinate first)
      if (a.coordinates.x !== b.coordinates.x) {
        return a.coordinates.x - b.coordinates.x;
      }

      // 4. y asc (lower y coordinate first)
      return a.coordinates.y - b.coordinates.y;
    });

    return sorted[0];
  }
}
