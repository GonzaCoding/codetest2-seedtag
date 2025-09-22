import { Controller, Post, Body } from '@nestjs/common';
import { RadarService } from './radar.service';
import { RadarRequestDto } from './dto/radar-request.dto';

@Controller('radar')
export class RadarController {
  constructor(private readonly radarService: RadarService) {}

  @Post()
  processRadar(@Body() radarRequest: RadarRequestDto) {
    // Pre-filter scan points by distance
    const filteredScanPoints = this.radarService.preFilterByDistance(
      radarRequest.scan,
    );

    // For now, return the first remaining point (temporary implementation)
    if (filteredScanPoints.length > 0) {
      const firstPoint = filteredScanPoints[0];
      return {
        x: firstPoint.coordinates.x,
        y: firstPoint.coordinates.y,
      };
    }

    // If no points remain after filtering, return default
    return { x: 0, y: 0 };
  }
}
