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
| -- app.controller.ts : 단일 경로가있는 기본 컴포넌트 입니다.  
| -- app.controller.spec.ts : 컨트롤러에 대한 단위 테스트입니다.
| -- app.module.ts : 애플리케이션의 루트 모듈입니다.
| -- app.service.ts : 하나의 방법으로 기본 서비스를 제공합니다.
| -- main.ts : [1] 번째로 실행되는 파일 마치 `server.js` 와 같다고 보면됩니다.

일단 번역기 돌린 내용으로 적어놨습니다.
생각 나는대로 수정하면서 고쳐가겠습니다

## Nest 실행하기

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

### [1] app.service.ts

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

### hot reload

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


# 에러노트

## wepback hot load 이슈
> https://github.com/webpack/webpack/issues/11714
점진적인 확인 후 이 플러그인의 문제입니다. assets-webpack-plugin v6.0.1.
"1"이 "5.1.2"로 롤백되면 오류가 발생하지 않습니다.
나중에 문제를 종료하겠습니다.


```sh
npm i --save-dev webpack webpack-cli webpack-node-externals ts-loader run-script-webpack-plugin
```

왜안되 ^^ㅣ발 