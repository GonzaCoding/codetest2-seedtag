import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RadarModule } from './radar/radar.module';

@Module({
  imports: [RadarModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
