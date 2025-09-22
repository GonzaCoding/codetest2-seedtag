import {
  Controller,
  Post,
  Get,
  Body,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { RadarService } from './radar.service';
import { RadarRequestDto } from './dto/radar-request.dto';
import { RadarResponseDto } from './dto/radar-response.dto';
import { PROTOCOLS_INFO } from './dto/protocols.dto';

@ApiTags('Radar')
@Controller('radar')
export class RadarController {
  constructor(private readonly radarService: RadarService) {}

  @Post()
  @ApiOperation({
    summary: 'Process radar scan and select target',
    description:
      'Analyzes radar scan data and applies targeting protocols to select the optimal target based on distance, enemy type, and ally presence.',
  })
  @ApiBody({
    type: RadarRequestDto,
    description: 'Radar scan data with protocols to apply',
    examples: {
      'closest-enemies': {
        summary: 'Find closest enemies',
        description: 'Select the enemy target closest to the origin',
        value: {
          protocols: ['closest-enemies'],
          scan: [
            {
              coordinates: { x: 0, y: 40 },
              enemies: { type: 'soldier', number: 10 },
            },
            {
              coordinates: { x: 0, y: 80 },
              enemies: { type: 'mech', number: 1 },
            },
          ],
        },
      },
      'prioritize-mech': {
        summary: 'Prioritize mech enemies',
        description: 'Select mech enemies over soldiers when available',
        value: {
          protocols: ['prioritize-mech'],
          scan: [
            {
              coordinates: { x: 0, y: 40 },
              enemies: { type: 'soldier', number: 10 },
            },
            {
              coordinates: { x: 0, y: 80 },
              enemies: { type: 'mech', number: 1 },
            },
          ],
        },
      },
      'multi-protocol': {
        summary: 'Multiple protocols',
        description: 'Apply multiple protocols in sequence',
        value: {
          protocols: ['assist-allies', 'closest-enemies'],
          scan: [
            {
              coordinates: { x: 0, y: 0 },
              enemies: { type: 'soldier', number: 5 },
            },
            {
              coordinates: { x: 10, y: 10 },
              enemies: { type: 'soldier', number: 3 },
              allies: 2,
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Target successfully selected',
    type: RadarResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid request data',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          description: 'Validation error messages',
          example: [
            'scan.0.enemies.type must be one of the following values: soldier, mech',
          ],
        },
        error: {
          type: 'string',
          description: 'Error type',
          example: 'Bad Request',
        },
        statusCode: {
          type: 'number',
          description: 'HTTP status code',
          example: 400,
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'No valid targets found after applying protocols',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'Error message',
          example: 'No target found',
        },
        error: {
          type: 'string',
          description: 'Error type',
          example: 'Not Found',
        },
        statusCode: {
          type: 'number',
          description: 'HTTP status code',
          example: 404,
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      type: 'object',
      properties: {
        error: {
          type: 'string',
          description: 'Error message',
          example: 'Internal server error',
        },
      },
    },
  })
  processRadar(@Body() radarRequest: RadarRequestDto) {
    try {
      // Pre-filter scan points by distance
      const filteredScanPoints = this.radarService.preFilterByDistance(
        radarRequest.scan,
      );

      // Apply protocols sequentially
      const processedPoints = this.radarService.applyProtocols(
        filteredScanPoints,
        radarRequest.protocols,
      );

      // Check if any targets remain after filtering and protocol application
      if (processedPoints.length === 0) {
        throw new NotFoundException('No target found');
      }

      // Return the first point after protocol application (protocols handle prioritization)
      const selectedTarget = processedPoints[0];

      return {
        x: selectedTarget.coordinates.x,
        y: selectedTarget.coordinates.y,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        { error: 'Internal server error' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('protocols')
  @ApiOperation({
    summary: 'Get available targeting protocols',
    description:
      'Returns a list of all available targeting protocols with their descriptions and categories.',
  })
  @ApiOkResponse({
    description: 'List of available protocols',
    type: [Object],
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Protocol name',
            example: 'closest-enemies',
          },
          description: {
            type: 'string',
            description: 'Protocol description',
            example: 'Select the enemy target closest to the origin (0,0)',
          },
          category: {
            type: 'string',
            description: 'Protocol category',
            example: 'distance',
            enum: ['distance', 'ally', 'mech'],
          },
        },
      },
    },
  })
  getProtocols() {
    return PROTOCOLS_INFO;
  }
}
