import { IProtocol, ProtocolName } from './protocol.interface';
import { ScanPoint } from '../interfaces/target.interface';

export class AvoidCrossfireProtocol implements IProtocol {
  name: ProtocolName = 'avoid-crossfire';

  apply(scanPoints: ScanPoint[]): ScanPoint[] {
    // Filter out points that have allies (avoid crossfire)
    return scanPoints.filter((point) => !point.allies || point.allies === 0);
  }
}
