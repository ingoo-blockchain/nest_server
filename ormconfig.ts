import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import dotenv from 'dotenv'

dotenv.config()

const host: string = process.env.DB_HOST || 'localhost'
const username: string = process.env.DB_USERNAME || 'ingoo2'
const password: string = process.env.DB_PASSWORD || 'ingoo2'
const database: string = process.env.DB_DATABASE || 'ingchat'

const config: TypeOrmModuleOptions = {
    type: 'mysql',
    host,
    port: 3306,
    username,
    password,
    database,
    entities: [],
    synchronize: true,
}

export = config
