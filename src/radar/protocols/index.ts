import { IProtocol } from './protocol.interface';

// Registry of all available protocols
// Will be populated as we implement each protocol
export const PROTOCOLS: Map<string, IProtocol> = new Map();
