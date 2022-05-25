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
