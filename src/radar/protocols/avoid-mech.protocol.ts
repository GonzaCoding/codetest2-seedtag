import { IProtocol, ProtocolName } from './protocol.interface';
import { ScanPoint } from '../interfaces/target.interface';

export class AvoidMechProtocol implements IProtocol {
  name: ProtocolName = 'avoid-mech';

  apply(scanPoints: ScanPoint[]): ScanPoint[] {
    // Filter out points with mech enemies
    return scanPoints.filter((point) => point.enemies.type !== 'mech');
  }
}
