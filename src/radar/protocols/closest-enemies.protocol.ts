import { IProtocol, ProtocolName } from './protocol.interface';
import { ScanPoint } from '../interfaces/target.interface';

export class ClosestEnemiesProtocol implements IProtocol {
  name: ProtocolName = 'closest-enemies';

  apply(scanPoints: ScanPoint[]): ScanPoint[] {
    // Calculate Euclidean distance from origin (0,0) for each point
    const pointsWithDistance = scanPoints.map((point) => ({
      ...point,
      distance: Math.sqrt(
        point.coordinates.x * point.coordinates.x +
          point.coordinates.y * point.coordinates.y,
      ),
    }));

    // Sort by distance (ascending - closest first)
    return pointsWithDistance
      .sort((a, b) => a.distance - b.distance)
      .map(({ distance, ...point }) => point); // Remove distance property from result
  }
}
