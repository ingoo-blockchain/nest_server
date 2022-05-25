import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class workspaceMember {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'timestamp', nullable: true })
    loggedInAt: Date
}
