import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

declare const module: any

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    const prefix = '/api/v1'
    app.setGlobalPrefix(prefix)

    const config = new DocumentBuilder()
        .setTitle('ingServe')
        .setDescription('연습을 위한 API 문서입니다.')
        .setVersion('1.0')
        .addCookieAuth('connect.sid')
        .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, document)

    const port = process.env.SERVER_PORT || 3000
    await app.listen(port)
    console.log(`서버 시작 포트는 : ${port}`)

    if (module.hot) {
        module.hot.accept()
        module.hot.dispose(() => app.close())
    }
}
bootstrap()
