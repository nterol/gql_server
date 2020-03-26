import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    BaseEntity,
    OneToMany,
} from 'typeorm';

import { User } from './User';
import { Note } from './Note';
import { Edge } from './Edge';

// import * as bcrypt from 'bcryptjs';

@Entity('graphs')
export class Graph extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', { length: 255 })
    title: string;

    @ManyToOne(
        () => User,
        user => user.graphs,
        { onDelete: 'SET NULL' },
    )
    author: User;

    @OneToMany(
        () => Note,
        note => note.graph,
        { onDelete: 'CASCADE' },
    )
    notes: Note[];

    @OneToMany(
        () => Edge,
        edge => edge.graph,
        { onDelete: 'CASCADE' },
    )
    edges: Edge[];
}
