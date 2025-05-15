import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientsModule } from './patients/patients.module';
import { StatisticsModule } from './statistics/statistics.module';
import { VitalSignsModule } from './vital-signs/vital-signs.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123',
      database: 'hospital',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Только для разработки!
    }),
    PatientsModule,
    StatisticsModule,
    VitalSignsModule,
  ],
})
export class AppModule {}
