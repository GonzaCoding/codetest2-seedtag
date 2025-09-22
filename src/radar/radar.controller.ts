import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RadarService } from './radar.service';
import { RadarRequestDto } from './dto/radar-request.dto';

@Controller('radar')
export class RadarController {
  constructor(private readonly radarService: RadarService) {}

  @Post()
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
}
