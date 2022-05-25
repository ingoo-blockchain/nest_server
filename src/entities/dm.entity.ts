import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class dm {
    @PrimaryGeneratedColumn()
    id: number

    @Column('text')
    content: string // TEXT가 들어갔다.. Notnull 설정어떻게?
}
