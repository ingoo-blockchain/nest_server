import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import dotenv from 'dotenv'
dotenv.config()

const host: string = process.env.DB_HOST || 'localhost'
const username: string = process.env.DB_USER || 'root'
const password: string = process.env.DB_PASSWORD || 'root'
const database: string = process.env.DB_DATABASE || 'ingchat'
const synchronize = true
const entities: string[] = [`${__dirname}/src/entities/*.entity{.ts,.js}`]
const migrations: string[] = [__dirname + '/src/migrations/**/*{.ts,.js}']
const cli = { migrationsDir: '/src/migrations' }
const migrationsRun = false

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

export = config
