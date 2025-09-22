import { Module } from '@nestjs/common';
import { RadarModule } from './radar/radar.module';

@Module({
  imports: [RadarModule],
})
export class AppModule {}
