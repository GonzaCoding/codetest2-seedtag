import { IsArray, IsString, IsNumber, IsOptional, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CoordinatesDto {
  @ApiProperty({ description: 'X coordinate', example: 0 })
  @IsNumber()
  x: number;

  @ApiProperty({ description: 'Y coordinate', example: 40 })
  @IsNumber()
  y: number;
}

export class EnemiesDto {
  @ApiProperty({ description: 'Enemy type', enum: ['soldier', 'mech'], example: 'soldier' })
  @IsEnum(['soldier', 'mech'])
  type: 'soldier' | 'mech';

  @ApiProperty({ description: 'Number of enemies', example: 10 })
  @IsNumber()
  number: number;
}

export class ScanPointDto {
  @ApiProperty({ description: 'Coordinates of the scan point', type: CoordinatesDto })
  @ValidateNested()
  @Type(() => CoordinatesDto)
  coordinates: CoordinatesDto;

  @ApiProperty({ description: 'Enemy information', type: EnemiesDto })
  @ValidateNested()
  @Type(() => EnemiesDto)
  enemies: EnemiesDto;

  @ApiProperty({ description: 'Number of allies (optional)', example: 5, required: false })
  @IsOptional()
  @IsNumber()
  allies?: number;
}

export class RadarRequestDto {
  @ApiProperty({ 
    description: 'List of protocols to apply', 
    example: ['avoid-mech'],
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  protocols: string[];

  @ApiProperty({ 
    description: 'List of scan points', 
    type: [ScanPointDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScanPointDto)
  scan: ScanPointDto[];
}
