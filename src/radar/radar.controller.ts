import { Controller, Post, Body } from '@nestjs/common';
import { RadarService } from './radar.service';
import { RadarRequestDto } from './dto/radar-request.dto';

@Controller('radar')
export class RadarController {
  constructor(private readonly radarService: RadarService) {}

  @Post()
  async processRadar(@Body() radarRequest: RadarRequestDto) {
    // Placeholder response for now
    return { x: 0, y: 0 };
  }
}
