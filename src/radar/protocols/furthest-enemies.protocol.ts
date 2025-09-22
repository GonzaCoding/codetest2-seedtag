import { IProtocol, ProtocolName } from './protocol.interface';
import { ScanPoint } from '../interfaces/target.interface';

export class FurthestEnemiesProtocol implements IProtocol {
  name: ProtocolName = 'furthest-enemies';

  apply(scanPoints: ScanPoint[]): ScanPoint[] {
    // Calculate Euclidean distance from origin (0,0) for each point
    const pointsWithDistance = scanPoints.map((point) => ({
      ...point,
      distance: Math.sqrt(
        point.coordinates.x * point.coordinates.x +
          point.coordinates.y * point.coordinates.y,
      ),
    }));

    // Sort by distance (descending - furthest first)
    return pointsWithDistance
      .sort((a, b) => b.distance - a.distance)
      .map(({ distance, ...point }) => point); // Remove distance property from result
  }
}
