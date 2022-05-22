# Nestjs 와 Express 비교해보기



|- GET /user : 내 정보 가져오기

|- POST /user  : 회원가입 



|- POST /user/login : 로그인

|- POST /user/logout : 로그아웃



**여기는 테스트용**

|- GET /user/profile?email=[value] : 해당 이메일 프로필

|- GET /user/profile/[email] : 해당 이메일 프로필



총 4개의 라우터와 4개의 미들웨어를 만들어봅시다,



## 1. 라우터랑 미들웨어 만들어보기.

nest-cli 배우기

**user model 만들기**

```sh
npx nest g module user
```

하여 기본틀 제작하기



CREATE src/user/user.module.ts (81 bytes)
UPDATE src/app.module.ts (680 bytes)



위와 같은 내용이 변경되었다며,  내용을 콘솔에 찍어줌,



**user service 만들기**

```
npx nest g service user
```





**user controller 만들기**

```
npx nest g controller user
```



순서대로 만들어주시는게 좋아요



이후 



express 로 치자면



**example express**

```javascript
const getUser = (req,res)=>{}
const postUser = (req,res)=>{}
const LogIn = (req,res) => {}
const LogOut = (req,res) => {}
// const getProfile = (req,res) => {}
// const getParamProfile = (req,res) => {}

app.get('/user', getUser)
app.post('/user', postUser)
app.post('/user/login',LogIn)
app.post('/user/logout',LogOut)
// app.get('/user/profile',getProfile)
// app.get('/user/profile/:email',getParamProfile)
```

이러한 코드가있다고 가정할때 

nest 에서 만드는방법은



**/src/user/user.controller.ts**

```typescript
import { Controller, Get, Post } from '@nestjs/common';

@Controller('user')
export class UserController {
    @Get()
    getUser() {
        
    }

    @Post()
    postUser() {
        
    }

    @Post('login')
    logIn() {
        
    }

    @Post('logout')
    logOut() {
        
    }
}
```



위에 express 코드와 같은결과물입니다. 





## 2. req정보 가져와보기 



req.body, req.query, req.params 를 가져와보도록 하겠습니다.



먼저 회원가입을 가정하고 

|- POST /user 



를 가지고만 테스트 해보겠습니다.

먼저 express 라면



### 2.1 req.body

**express**

```javascript
// app.use( express.json() ) 되었다고 가정.

const postUser = (req,res) => {
	const {email, nickname, password} = req.body
	    
    res.json({
    	email,
        nickname,
        password
    })
}

app.post('/user',postUser)
```



지금생각해도 심플 그자체...

정말 HTTP 대한 개념만잡혀도 코딩하기 너무 쉬운 express



이번엔 

Nest 기준으로 작성해보도록 하겠습니다.



**/src/user/user.controller.ts** app.post('user')  라우터와, 미들웨어 까지 역활

```typescript
import { Body, Controller, Get, Post } from '@nestjs/common'
import { JoinRequestDto } from './dto/join.request.dto'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}
    
    //... 생략
    @Post()
    postUser(@Body() data: JoinRequestDto) { //[1] JoinRequestDto는 직접제작
        const user = this.userService.postUser(data.email, 			data.nickname, data.password) //[2] 여기도 서비스를 직접 만들어줘야합니다.
        return user
    }
}
```



**/src/user/dto/join.request.dto.ts**

```typescript
export class JoinRequestDto {
    public email: string
    public nickname: string
    public password: string
}
/*
* nest 에서는 export default 안쓰는게 좋다고 하네요 ^^;;
* HTTP Request Body 내용에 담길 객체 유형을 지정해주면서 받아줘야하기때문에
* 만들었습니다 DTO 라는것은 Data Transfer Object 약자로
* 데이터를 전달받은 객체 예를들면
* HTTP body 내용에 {name:'ingoo'} 이면 name이란 속성에 'ingoo'
* 라는 값이 들어간거면
* name 은 속성명 ingoo 값인데 값의 데이터타입이? string이죠. 만약 이걸 코딩한다치면 아래와 같은 코드가 되겠네요, 이것이 타입스크립트 장점이면서 단점이죠,
코드가 길어지는것은 어쩔수없습니다.
*/

/*
class UserDto {
    public name: string
}
*/
```



**/src/user/user.service.ts**  res.json()  의 역활.

```typescript
import { Injectable } from '@nestjs/common'

@Injectable()
export class UserService {
    postUser(email: string, nickname: string, password: string) {
        return {
            email,
            nickname,
            password,
        }
    }
}
```



세상불편 ..

Postman 으로 한번 테스트해보세요.



### 2.2 req.query / req.param



**express**

```javascript
const getProfile = (req,res) => {
    const email = req.query.email
    res.json({
        result:true,
        email
    })
}
const getParamProfile = (req,res) => {
    const email = req.params.email
    res.json({
        result:true,
        email
    })
}

app.get('/user/profile', getProfile)
app.get('/user/profile/:email', getParamProfile)
```









**nest**

**/src/user/user.controller.ts**

```typescript
 @Get('profile')
     getProfile(@Query() query) {
     const email = query.email
     const userinfo = this.userService.getProfile(email)
     return userinfo
 }

@Get('profile/:email')
    getParamProfile(@Param() param) {
    const email = param.email
    const userinfo = this.userService.getProfile(email)
    return userinfo
}
```



**/src/user/user.service.ts**

```javascript
import { Injectable } from '@nestjs/common'

@Injectable()
export class UserService {
    // ...생략
    getProfile(email: string) {
        return {
            result: true,
            email,
        }
    }
}

```



