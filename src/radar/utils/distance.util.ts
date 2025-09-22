import { ScanPoint } from '../interfaces/target.interface';

/**
 * Calculate Euclidean distance from origin (0,0) to a point
 * @param x X coordinate
 * @param y Y coordinate
 * @returns Distance from origin
 */
export function calculateDistance(x: number, y: number): number {
  return Math.sqrt(x * x + y * y);
}

/**
 * Check if a scan point is within the maximum attack range (100m)
 * @param scanPoint The scan point to check
 * @returns True if within range, false otherwise
 */
export function withinRange(scanPoint: ScanPoint): boolean {
  const distance = calculateDistance(
    scanPoint.coordinates.x,
    scanPoint.coordinates.y,
  );
  return distance <= 100;
}
