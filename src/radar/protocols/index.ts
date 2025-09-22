import { IProtocol } from './protocol.interface';
import { ClosestEnemiesProtocol } from './closest-enemies.protocol';
import { FurthestEnemiesProtocol } from './furthest-enemies.protocol';

// Registry of all available protocols
export const PROTOCOLS: Map<string, IProtocol> = new Map();

// Register distance protocols
PROTOCOLS.set('closest-enemies', new ClosestEnemiesProtocol());
PROTOCOLS.set('furthest-enemies', new FurthestEnemiesProtocol());
