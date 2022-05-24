import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import dotenv from 'dotenv'

dotenv.config()

function ormConfig(): TypeOrmModuleOptions {
    const host: string = process.env.DB_HOST || 'localhost'
    const username: string = process.env.DB_USERNAME || 'ingoo2'
    const password: string = process.env.DB_PASSWORD || 'ingoo2'
    const database: string = process.env.DB_DATABASE || 'ingchat'
    const synchronize: boolean = true
    const entities: string[] = [`${__dirname}/entities/*.entity{.ts,.js}`]
    const migrations: string[] = [__dirname + '/migrations/**/*{.ts,.js}']
    const cli = { migrationsDir: '/migrations' }
    const migrationsRun: boolean = false

    const config: TypeOrmModuleOptions = {
        type: 'mysql',
        host,
        username,
        password,
        database,
        logging: true,
        synchronize,
        entities,
        migrations,
        cli,
        migrationsRun,
    }

    return config
}

export { ormConfig }
