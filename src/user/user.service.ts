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

    getProfile(email: string) {
        return {
            result: true,
            email,
        }
    }
}
