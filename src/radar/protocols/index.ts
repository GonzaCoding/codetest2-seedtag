import { IProtocol } from './protocol.interface';
import { ClosestEnemiesProtocol } from './closest-enemies.protocol';
import { FurthestEnemiesProtocol } from './furthest-enemies.protocol';
import { AssistAlliesProtocol } from './assist-allies.protocol';
import { AvoidCrossfireProtocol } from './avoid-crossfire.protocol';
import { PrioritizeMechProtocol } from './prioritize-mech.protocol';
import { AvoidMechProtocol } from './avoid-mech.protocol';

// Registry of all available protocols
export const PROTOCOLS: Map<string, IProtocol> = new Map();

// Register distance protocols
PROTOCOLS.set('closest-enemies', new ClosestEnemiesProtocol());
PROTOCOLS.set('furthest-enemies', new FurthestEnemiesProtocol());

// Register ally protocols
PROTOCOLS.set('assist-allies', new AssistAlliesProtocol());
PROTOCOLS.set('avoid-crossfire', new AvoidCrossfireProtocol());

// Register mech protocols
PROTOCOLS.set('prioritize-mech', new PrioritizeMechProtocol());
PROTOCOLS.set('avoid-mech', new AvoidMechProtocol());
