import { Injectable } from '@nestjs/common';
import { ScanPoint } from './interfaces/target.interface';
import { withinRange } from './utils/distance.util';

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
}
