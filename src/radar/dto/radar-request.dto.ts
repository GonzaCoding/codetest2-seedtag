import {
  IsArray,
  IsString,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CoordinatesDto {
  @ApiProperty({
    description: 'X coordinate of the scan point',
    example: 0,
    minimum: -1000,
    maximum: 1000,
  })
  @IsNumber()
  x: number;

  @ApiProperty({
    description: 'Y coordinate of the scan point',
    example: 40,
    minimum: -1000,
    maximum: 1000,
  })
  @IsNumber()
  y: number;
}

export class EnemiesDto {
  @ApiProperty({
    description: 'Type of enemy unit',
    enum: ['soldier', 'mech'],
    example: 'soldier',
    enumName: 'EnemyType',
  })
  @IsEnum(['soldier', 'mech'])
  type: 'soldier' | 'mech';

  @ApiProperty({
    description: 'Number of enemy units at this location',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsNumber()
  number: number;
}

export class ScanPointDto {
  @ApiProperty({
    description: 'Geographic coordinates of the scan point',
    type: CoordinatesDto,
  })
  @ValidateNested()
  @Type(() => CoordinatesDto)
  coordinates: CoordinatesDto;

  @ApiProperty({
    description: 'Enemy unit information at this location',
    type: EnemiesDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => EnemiesDto)
  enemies: EnemiesDto;

  @ApiProperty({
    description: 'Number of allied units present (optional)',
    example: 5,
    required: false,
    minimum: 0,
    maximum: 50,
  })
  @IsOptional()
  @IsNumber()
  allies?: number;
}

export class RadarRequestDto {
  @ApiProperty({
    description: 'List of targeting protocols to apply in sequence',
    example: ['avoid-mech'],
    type: [String],
    items: {
      type: 'string',
      enum: [
        'closest-enemies',
        'furthest-enemies',
        'assist-allies',
        'avoid-crossfire',
        'prioritize-mech',
        'avoid-mech',
      ],
    },
    minItems: 0,
    maxItems: 10,
  })
  @IsArray()
  @IsString({ each: true })
  protocols: string[];

  @ApiProperty({
    description:
      'Array of radar scan points containing enemy and ally information',
    type: [ScanPointDto],
    minItems: 1,
    maxItems: 100,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScanPointDto)
  scan: ScanPointDto[];
}
