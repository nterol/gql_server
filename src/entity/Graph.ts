import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    BaseEntity,
    OneToMany,
    JoinTable,
} from 'typeorm';

import { User } from './User';
import { Note } from './Note';
import { Edge } from './Edge';

@Entity('graphs')
export class Graph extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', { length: 255 })
    title: string;

    @ManyToOne(
        () => User,
        user => user.graphs,
        { onDelete: 'SET NULL', eager: true },
    )
    @JoinTable()
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
