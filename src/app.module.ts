import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientsModule } from './patients/patients.module';
import { StatisticsModule } from './statistics/statistics.module';

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
  ],
})
export class AppModule {}
