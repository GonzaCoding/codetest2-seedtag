import { ApiProperty } from '@nestjs/swagger';

export class ProtocolInfoDto {
  @ApiProperty({
    description: 'Protocol name',
    example: 'closest-enemies',
  })
  name: string;

  @ApiProperty({
    description: 'Protocol description',
    example: 'Select the enemy target closest to the origin (0,0)',
  })
  description: string;

  @ApiProperty({
    description: 'Protocol category',
    example: 'distance',
    enum: ['distance', 'ally', 'mech'],
  })
  category: string;
}

export const PROTOCOLS_INFO: ProtocolInfoDto[] = [
  {
    name: 'closest-enemies',
    description: 'Select the enemy target closest to the origin (0,0)',
    category: 'distance',
  },
  {
    name: 'furthest-enemies',
    description: 'Select the enemy target furthest from the origin (0,0)',
    category: 'distance',
  },
  {
    name: 'assist-allies',
    description: 'Prioritize targets that have allied units present',
    category: 'ally',
  },
  {
    name: 'avoid-crossfire',
    description: 'Avoid targets that have allied units present',
    category: 'ally',
  },
  {
    name: 'prioritize-mech',
    description: 'Prioritize mech enemies over soldiers when available',
    category: 'mech',
  },
  {
    name: 'avoid-mech',
    description: 'Avoid mech enemies, only target soldiers',
    category: 'mech',
  },
];
