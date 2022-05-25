# TypeORM



## DB 연결
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

> typeorm 이 자동적으로 읽어주는 파일명 ormconfig.json

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





## 테이블 모델 생성



**디렉토리 구조**

```
├ /src/entites
├─ [테이블명].entity.ts
```



**User.entity**

> 유저 테이블 생성 

```ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: string

    @Column()
    nickname: string

    @Column()
    password: string
}
```



설정이 제대로 되어있다면,



**package.json**

> Package.json 파일에 scripts 부분 내용에 추가

```json
"scripts":{
    "schema:drop": "ts-node ./node_modules/typeorm/cli.js schema:drop",
    "schema:sync": "ts-node ./node_modules/typeorm/cli.js schema:sync"
}
```



내용을 추가한 이유는 `nestjs` 에서 

`npm run schema:sync" 로 처리하여 싱크를 맞추는것이 좋아보인다.



그리고 Mysql 접속하여 확인해봤더니.

```
mysql> desc user;
+----------+--------------+------+-----+---------+----------------+
| Field    | Type         | Null | Key | Default | Extra          |
+----------+--------------+------+-----+---------+----------------+
| id       | int          | NO   | PRI | NULL    | auto_increment |
| email    | varchar(255) | NO   |     | NULL    |                |
| nickname | varchar(255) | NO   |     | NULL    |                |
| password | varchar(255) | NO   |     | NULL    |                |
+----------+--------------+------+-----+---------+----------------+
```



varchar들이 전부다 255 이다 

느낌상 @Colum()  데코레이터 인자값에 옵션이 필요할거같다.

찾아보니 맞았다.



> 참고 URL
>
> https://typeorm.delightful.studio/interfaces/_decorator_options_columnoptions_.columnoptions.html



`optional`  { length }

> length : string | number



넣어보고 다시 실행해봤다. 

```typescript
 @Column({ length: 100 })
 email: string
```



다시 sync 명령어를 사용하여 돌려보니

```
+----------+--------------+------+-----+---------+----------------+
| Field    | Type         | Null | Key | Default | Extra          |
+----------+--------------+------+-----+---------+----------------+
| id       | int          | NO   | PRI | NULL    | auto_increment |
| nickname | varchar(255) | NO   |     | NULL    |                |
| password | varchar(255) | NO   |     | NULL    |                |
| email    | varchar(100) | NO   |     | NULL    |                |
+----------+--------------+------+-----+---------+----------------+
```

이메일의 varchar 바뀜 ^^



자주쓰는게 무엇일까 고민해봤다, 한번씩은 넣어봐야할거같아서

`not null`,  `default` , `unique` , `comment`



`Optional` not null

> nullable : undefined | true | false



`Optional` unique

> unique : undefined | true | false



`Optional` default

> default : any 



```typescript
// ... 생략

@Column({ length: 100, nullable: true, unique: true, default: 'web7722@gmail.com' })
email: string

// ... 생략
```



```
+----------+--------------+------+-----+-------------------+----------------+
| Field    | Type         | Null | Key | Default           | Extra          |
+----------+--------------+------+-----+-------------------+----------------+
| id       | int          | NO   | PRI | NULL              | auto_increment |
| nickname | varchar(255) | NO   |     | NULL              |                |
| password | varchar(255) | NO   |     | NULL              |                |
| email    | varchar(100) | YES  | UNI | web7722@gmail.com |                |
+----------+--------------+------+-----+-------------------+----------------+
```



아주 잘됩니다. 



근대 이것도 데코레이터 함수가 안이뻐 보이기는한데...

다른방법이 있을거같긴한데..  다음에 알아보도록 하자.



그리고 혹시 Field Type 이 Text 이고,  null 허용 표현할려고 할때

```typescript
@Column('text', {
     nullable: false,
})
```





### enum 타입 넣기

```typescript
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

enum IsCategory {
    CHAT = 'chat',
    DM = 'dm',
    SYSTEM = 'system',
}

@Entity()
export class mention {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'enum', enum: IsCategory })
    category: string

    @Column()
    chatid: number
}

```



이렇게 쓴다 하더라..

```javascript
@Column('enum',{ enum:IsCategory }) 
```

도 되지않을까 싶다. 





### 날짜타입 넣기

```typescript
 @Column({ type: 'timestamp', nullable: true })
 loggedInAt: Date
```





## 외래키 설정하기

### 1:1



### 1:N



자식.OneToMany()

부모.ManyToOne()





### N:M







## 초기 데이터 넣어보기

> 공식문서
> https://www.npmjs.com/package/typeorm-seeding

```sh
npm install typeorm-seeding
```

> **default**
> The default paths are src/database/{seeds,factories}/**/*{.ts,.js}

기본 패스명이 개인적으로 너무 맘에안든다
시퀄라이즈 영향일지는 모르겠지만.
databases 디렉토리가 싫다. 바꾸고싶다면
`ormconfig.ts` 에서 변경이 가능하다고 한다.

```ts
module.exports = {
  ...
  seeds: ['src/seeds/**/*{.ts,.js}'],
  factories: ['src/factories/**/*{.ts,.js}'],
}
```

그리고 가짜 데이터를 넣고싶을땐 좋은 라이브러리가있다.

fakter 이다.
```sh 
npm install -D @types/faker
```