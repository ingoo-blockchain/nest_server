# TypeORM

```sh
npm install --save @nestjs/typeorm typeorm@0.2 mysql2
```

DB Connection 만 해보기
**app.module.ts** 에서 작업합시다,

```ts
import { TypeOrmModule } from '@nestjs/typeorm'


@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        UserModule,
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'ingoo2',
            password: 'ingoo2',
            database: 'ingchat',
            entities: [],
            synchronize: true,
        }),
    ],
    controllers: [AppController],
    providers: [AppService, ConfigService],
})
```

데코레이터 함수인 module에다가 TypeOrmModule을 설정한뒤, 내용을 입력해주시고 서버를재시작하면
[Nest] 1865 - 05/24/2022, 7:53:35 PM LOG [InstanceLoader] TypeOrmCoreModule dependencies initialized +312ms
이러한 내용으로 로그가 떴다면 성공

하지만 뭔가 모양이... 너무 이상하다
공식홈페이지를 찾아보니설정값을 불러와주는 것들이 있더라.

ormconfig.json 으로 json파일을 넣으면 바로 실행해주더라

```ts
@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        UserModule,
        TypeOrmModule.forRoot(),
    ],
    controllers: [AppController],
    providers: [AppService, ConfigService],
})
```

**ormconfig.json**

```
{
    "type": "mysql",
    "host": "localhost",
    "port": 3306,
    "username": "ingoo2",
    "password": "ingoo2",
    "database": "ingchat",
    "entities": [],
    "synchronize": true
}

```

공식문서를 찾아보니 ormconfig.json 파일은 typeorm 라이브러리에서 실행되면 로드가된다하더라.

하지만 이렇게할경우에는

autoLoadEntities 와 retryDelay는 내부적으로 지원하지 않는다고하여,
직접설정해줘야합니다.

그리고
ormconfig.json 말고 확장자를 ts로 바꾸고싶은데 어떻게 안되나..?
