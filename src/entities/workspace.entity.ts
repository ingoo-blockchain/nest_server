import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.entity'

@Entity()
export class workspace {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ length: 30, unique: true })
    name: string

    @Column({ length: 30, unique: true })
    url: string

    @ManyToOne((type) => User, (User) => User.workspace, { nullable: false, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    user!: User
}
