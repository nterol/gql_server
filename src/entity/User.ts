import {
    Entity,
    Column,
    BaseEntity,
    PrimaryGeneratedColumn,
    BeforeInsert,
    OneToMany,
} from 'typeorm';

import * as bcrypt from 'bcryptjs';

import { Graph } from './Graph';
import { Note } from './Note';
import { Edge } from './Edge';

@Entity('users')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', { length: 255 })
    email: string;

    @Column('text')
    password: string;

    @Column('boolean', { default: false })
    confirmed: boolean;

    @Column('boolean', { default: false })
    accountLocked: boolean;

    @OneToMany(
        type => {
            console.log('USER TYPE', type);
            return Graph;
        },
        graph => graph.author,
    )
    graphs: Graph[];

    @OneToMany(
        type => {
            console.log('User notes', type);
            return Note;
        },
        note => note.author,
    )
    notes: Note[];

    @OneToMany(
        () => Edge,
        edge => edge.author,
    )
    edges: Edge[];

    @BeforeInsert()
    async hashPasswordBeforeInsert() {
        this.password = await bcrypt.hash(this.password, 10);
    }
}
