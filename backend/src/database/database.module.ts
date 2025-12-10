import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        const dbName = configService.get<string>('MONGODB_DB');
        console.log(`[DatabaseModule] Connecting to MongoDB: ${uri?.substring(0, 50)}... (DB: ${dbName})`);
        return {
          uri,
          dbName,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
