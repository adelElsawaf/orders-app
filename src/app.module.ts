import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './common/redis/redis.module';
import { ProductModule } from './product/product.module';
import { RateLimiterModule } from './common/rate-limiter/rate-limiter.module';
import { UserModule } from './user/user.module';
import { OrdersModule } from './order/orders.module';
import { OrderItemModule } from './order-item/order-item.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    RedisModule,
    ProductModule,
    RateLimiterModule,
    UserModule,
    OrdersModule,
    OrderItemModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
