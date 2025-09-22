export interface Coordinates {
  x: number;
  y: number;
}

export interface Enemies {
  type: 'soldier' | 'mech';
  number: number;
}

export interface ScanPoint {
  coordinates: Coordinates;
  enemies: Enemies;
  allies?: number;
}
