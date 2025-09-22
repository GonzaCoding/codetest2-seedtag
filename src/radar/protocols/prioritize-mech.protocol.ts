import { IProtocol, ProtocolName } from './protocol.interface';
import { ScanPoint } from '../interfaces/target.interface';

export class PrioritizeMechProtocol implements IProtocol {
  name: ProtocolName = 'prioritize-mech';

  apply(scanPoints: ScanPoint[]): ScanPoint[] {
    // Partition points: mech enemies first, then other enemy types
    const mechPoints = scanPoints.filter(
      (point) => point.enemies.type === 'mech',
    );
    const otherPoints = scanPoints.filter(
      (point) => point.enemies.type !== 'mech',
    );

    // If there are mech enemies, return them first, otherwise return all points
    return mechPoints.length > 0 ? [...mechPoints, ...otherPoints] : scanPoints;
  }
}
