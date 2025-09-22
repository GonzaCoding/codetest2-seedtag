import { IProtocol, ProtocolName } from './protocol.interface';
import { ScanPoint } from '../interfaces/target.interface';

export class AssistAlliesProtocol implements IProtocol {
  name: ProtocolName = 'assist-allies';

  apply(scanPoints: ScanPoint[]): ScanPoint[] {
    // Partition points: those with allies first, then those without
    const pointsWithAllies = scanPoints.filter(
      (point) => point.allies && point.allies > 0,
    );
    const pointsWithoutAllies = scanPoints.filter(
      (point) => !point.allies || point.allies === 0,
    );

    // Return points with allies first, then points without allies
    return [...pointsWithAllies, ...pointsWithoutAllies];
  }
}
