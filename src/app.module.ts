import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { LoggerMiddleware } from './middlewares/logger.middleware'
import { UserModule } from './user/user.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as config from '../ormconfig'

@Module({
    imports: [TypeOrmModule.forRootAsync(config), ConfigModule.forRoot({ isGlobal: true }), UserModule],
    controllers: [AppController],
    providers: [AppService, ConfigService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer.apply(LoggerMiddleware).forRoutes('*')
    }
}
