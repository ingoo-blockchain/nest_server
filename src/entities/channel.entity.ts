import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Channel {
    @PrimaryGeneratedColumn()
    id: Number

    @Column()
    name: string

    @Column()
    private: string
}
