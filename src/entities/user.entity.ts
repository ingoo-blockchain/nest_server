import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { channelChat } from './channelChat.entity'
import { workspace } from './workspace.entity'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 30,
        nullable: true,
        unique: true,
    })
    email: string

    @Column({ length: 30 })
    nickname: string

    @Column({ length: 100 })
    password: string

    @OneToMany((type) => workspace, (workspace) => workspace.id)
    workspace!: workspace

    @OneToMany((type) => channelChat, (channelChat) => channelChat.id)
    channelChat!: channelChat
}
