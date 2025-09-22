import { Injectable } from '@nestjs/common';
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
}
