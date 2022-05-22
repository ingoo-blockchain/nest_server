import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { JoinRequestDto } from './dto/join.request.dto'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get()
    getUser() {}

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

    @Post()
    postUser(@Body() data: JoinRequestDto) {
        const user = this.userService.postUser(data.email, data.nickname, data.password)
        return user
    }

    @Post('login')
    logIn() {}

    @Post('logout')
    logOut() {}
}
