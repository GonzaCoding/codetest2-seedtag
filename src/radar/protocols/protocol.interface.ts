import { ScanPoint } from '../interfaces/target.interface';

export type ProtocolName =
  | 'closest-enemies'
  | 'furthest-enemies'
  | 'assist-allies'
  | 'avoid-crossfire'
  | 'prioritize-mech'
  | 'avoid-mech';

export interface IProtocol {
  name: ProtocolName;
  apply(scanPoints: ScanPoint[]): ScanPoint[];
}
