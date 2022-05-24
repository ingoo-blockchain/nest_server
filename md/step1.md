# NestJS 배우기

> 공식문서 https://nestjs.com/

공식문서에 따르면, Typescript 를 사랑하고 Nodejs를 사랑하는 사람이 웹서버 구축
을 할수있는 프레임워크를 만들었다고 하네요 그리고 기본적으로 Typescript 를 사용하다보니
babel 컴파일러가 존재한다고 합니다.

## Nest 프로젝트 생성하기

NestJS 프로젝트 생성하기

```sh
npm install -g @nestjs/cli
nest new [프로젝트명]

# 패지키 매니저 선택하라고 나옴 원하시는거 선택하시면됩니다.
# 저는 npm 설치했습니다.
```

NestJs는 프레임워크 수준이기때문에,
디렉토리 구조 파악하는것을 우선시 하겠습니다.

그래도 JS 유저라면, prettier, tsconfig, eslint 세팅은 본인의 성향에맞게 선택해주세요

저는 `prettier` 와 `tsconfig` 만 설정바꿨습니다.

**prettier**

```json
{
    "printWidth": 120,
    "tabWidth": 4,
    "singleQuote": true,
    "trailingComma": "all",
    "semi": false
}
```

**tsconfig**

```json
...
"esModuleInterop": true, /* 이것만 추가했습니다. */
```

## Nest 디렉토리 구조 파악하기

| - /src
| -- app.controller.ts : [3] express로 치면 router 개념 입니다.  
| -- app.controller.spec.ts : 컨트롤러에 대한 단위 테스트입니다.
| -- app.module.ts : [2] 애플리케이션의 루트 모듈입니다.
| -- app.service.ts : [4] express 의 res.send, res.render, res.json 과 같은 응답코드
| -- main.ts : [1] 번째로 실행되는 파일 마치 `server.js` 와 같다고 보면됩니다.

일단 번역기 돌린 내용으로 적어놨습니다.
생각 나는대로 수정하면서 고쳐가겠습니다

## Nest 기초 실행하기 & 설정해보기

기본적으로 package.json 에 보시면 어어엄청많은 실행명령어가있습니다.
단위테스트를 jest 를 쓰는거같네요. 난 mocha가 좋은데..

```sh
npm run start
```

음 서버를 시작하니

|- /dist
폴더 안에 번들이 되는군요,
마치 webpack 같은 번들 프로그램이 존재하는거 같습니다.

기본 포트가 3000 번인거같습니다.
`main.ts` 에 express 의 매서드처럼 보이는 app.listen() 이 존재하네요,
첫번째 인자값이 3000 번인거 보니 여기가 처음 시작지점인거 같습니다.

이후 브라우저에서 http://localhost:3000 을 쳐보니,
Hello world! 라는 응답을 주었고,

이후 `app.service.ts` 에 들어가서 내용을 살펴보니
Hello world! 라는 텍스트가 적혀있었습니다.
내용을 Hello nest로 변경뒤 브라우저를 새고로침 했는데 변경이 안되네요,
아마 nodemon 처럼 되는건 아닌거같습니다.

### 1. app.service.ts

실행해보니 내가 현 몇번 포트를 사용하고있는지 console.log 안찍히더라고요,
한번 찍어보겠습니다.

```ts
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootsrap() {
    const app = await NestFactory.create(AppModule)
    const port = process.env.SERVER_PORT || 3000
    await app.listen(port)
    console.log(`서버 시작 : ${port}`)
}
bootsrap()
```

함수명이 bootstrap 이 헷갈릴거같아서 main으로 바꾸고,
환경변수를 통해서 설정한 뒤, port를 console.log 로 찍을수있게 변경했습니다.

### 2. hot reload - 아직안됨 테스트중.

React 에서 webpack 설정중 devServer
hotreload 를 설정하셨다면 기억나실거에요,

nodemon 이 없나 했는데 있긴하네요,

공식문서를 뒤져보니 나오네요

> https://docs.nestjs.com/v7/recipes/hot-reload

node로 백앤드 구현할려면 이제
webpakc도 알아야하다니,, 이럴거면 둘다해버리는게 좋을지도..

```sh
npm install -D webpack-node-externals run-script-webpack-plugin webpack
```

|- webpack-hmr.config.js : 프로젝트 루트 디렉토리에 파일생성해줍시다.

**webpack-hmr.config.js**

```js
const nodeExternals = require('webpack-node-externals')
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin')

module.exports = function (options, webpack) {
    return {
        ...options,
        entry: ['webpack/hot/poll?100', options.entry],
        watch: true,
        externals: [
            nodeExternals({
                allowlist: ['webpack/hot/poll?100'],
            }),
        ],
        plugins: [
            ...options.plugins,
            new webpack.HotModuleReplacementPlugin(),
            new webpack.WatchIgnorePlugin({
                paths: [/\.js$/, /\.d\.ts$/],
            }),
            new RunScriptWebpackPlugin({ name: options.output.filename }),
        ],
    }
}
```

**main.ts**

```ts
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
declare const module: any

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    const port = process.env.SERVER_PORT || 3000
    await app.listen(port)
    console.log(`서버 시작 : ${port}`)

    if (module.hot) {
        module.hot.accept()
        module.hot.dispose(() => app.close())
    }
}
bootstrap()
```

### 3. 처리과정 (넣을예정)

### 4. express -> dotenv 를 nestjs 에서 해보기

> 공식문서 참조
>
> https://docs.nestjs.com/recipes/prisma#set-up-prisma

```sh
npm install @nestjs/config
```

**app.modules.ts**

```typescript
// ...생략
import { ConfigModule } from '@nestjs/config'

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [AppController],
    providers: [AppService],
})
```

@module 데코레이트 안에 imports 속성 배열값에 module을 집어넣어주세요.

설정끝

이후 프로젝트 루트 디렉토리에 파일생성

**.env**

```
SERVER_POST=3500
DB_HOST=127.0.0.1
DB_USER=ingoo2
DB_PASSWORD=ingoo2
DB_DATABASE=nest
```

**app.service.ts**

```typescript
@Injectable()
export class AppService {
    getHello(): string {
        return process.env.SERVER_POST
    }
}
```

이후 파일명으로

.env.development

.env.production

으로 처리할수있습니다

환경변수 NODE_ENV 에 따라

.env.development 으로 실행할지

.env.production 으로 실행할지

나눠서 처리가 가능하다고합니다.

.env 내장된 기능이 아니라

nestjs에서 설정해놓은 세팅이라고 하네요,

cross-env 로 한번 테스트 해보도록하죠,

### 5. express 의 미들웨어 만들어보기

express 기준 매 라우터마다 console.log를 찍은 것을 만들어본다면

어떤 라우터든 실행될떄마다 특정 미들웨어가 실행되어,

req.의 내용을 찍어준다고 하면

```javascript
app.use((req, res, next) => {
    console.log(req.headers)
    next()
})
```

로 구현이 가능하겠죠,

이걸 nest 에서 구현해보도록 하겠습니다.

|- /src

|-+ /middlewares

|--+ logger.middleware.ts

대부분 어딜가든 파일명부터 가독성을 높혀주는것이 좋습니다.

> 사실 나도 잘안지킴 ^^;;

#### 5. 1파일명 컨벤션

`[이름] . [역활내용] . [확장자] `

무저건 이렇게 만들어야 실행되는것이 아니라. 파일면 컨벤션이라 보시면될듯?

그래서 저희도 express 할때

​ 이름 역활내용 확장자

> user .controller .js

기억나시나요? user에 관련된 controller 파일이다 라는것을 명시해주고있죠

### 5. 2 logger.middleware.ts

```typescript
import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private logger = new Logger('HTTP')

    use(req: Request, res: Response, next: NextFunction): void {
        const { ip, method, originalUrl } = req
        const userAgent = req.get('user-agent') || ''

        res.on('finish', () => {
            const { statusCode } = res
            const contentLenght = res.get('content-lenght')
            this.logger.log(`${method} ${originalUrl} ${statusCode} ${contentLenght} - ${userAgent} ${ip}`)
        })

        next()
    }
}
```

### app.module.ts

```typescript
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { LoggerMiddleware } from './middlewares/logger.middleware'

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true })],
    controllers: [AppController],
    providers: [AppService, ConfigService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer.apply(LoggerMiddleware).forRoutes('*')
    }
}
```

이후 서버 시작하시고

브라우저에서 요청날리면

[Nest] 28296 - 2022. 05. 22. 오후 2:19:41 LOG [HTTP] GET / 304 undefined - Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36 ::1

이러한 로그가 뜰거임.

### 5.3 설명

implements , injectable (DI) 에 대해서 설명

향후..해보자..

> 참고사이트
>
> https://medium.com/crocusenergy/nestjs-middleware-%EA%B0%9C%EB%85%90-%EB%B0%8F-%EC%8B%A4%EC%8A%B5-649b14bf65ff

##

### 6. Swagger 를 통한 API문서제작

> 참고사이트
>
> https://docs.nestjs.com/openapi/introduction

```sh
npm install @nestjs/swagger swagger-ui-express
```

**main.ts**

```typescript
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
```

http://localhost:3000/api 에 들어가면 나온다.

### 나중에할거

`GET auth/login` 요청시 Hello Login 을 띄어보겠습니다.

> IoC ( Inversion of Control, 제어의 역전)

데코레이터

# 에러노트

## wepback hot load 이슈

> https://github.com/webpack/webpack/issues/11714
> 점진적인 확인 후 이 플러그인의 문제입니다. assets-webpack-plugin v6.0.1.
> "1"이 "5.1.2"로 롤백되면 오류가 발생하지 않습니다.
> 나중에 문제를 종료하겠습니다.

```sh
npm i --save-dev webpack webpack-cli webpack-node-externals ts-loader run-script-webpack-plugin
```

일단 그만하자... npm run start:dev로 처리위주로 갑니다.

220524/ 이슈해결 방법 찾음

run-script-webpack-plugin 버전이 현 0.12 인데, 0.11 로 처리할시 이슈 사항이없을거같다고하여,
시전해봄.

일단 node_modules 디렉토리 삭제한다음에
rm ./node_modules

pacage.json 파일안에 devDependencies 을

"run-script-webpack-plugin": "^0.0.12", -> "run-script-webpack-plugin": "^0.0.11",
변경이후 다시
npm install

이후 다시 웹팩으로 실행하는것으로 돌려봤을때

"start:dev-watch": "nest build --webpack --watch --webpackPath webpack-hmr.config.js",

npm run start:dev-watch

잘되었다 ^\_^..
