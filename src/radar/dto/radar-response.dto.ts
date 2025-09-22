import { ApiProperty } from '@nestjs/swagger';

export class RadarResponseDto {
  @ApiProperty({
    description: 'X coordinate of the selected target',
    example: 0,
    type: 'number',
  })
  x: number;

  @ApiProperty({
    description: 'Y coordinate of the selected target',
    example: 40,
    type: 'number',
  })
  y: number;
}
