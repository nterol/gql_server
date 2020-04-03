import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
    BaseEntity,
} from 'typeorm';

import { User } from './User';
import { Edge } from './Edge';
import { Graph } from './Graph';

@Entity('notes')
export class Note extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', { length: 255 })
    title: string;

    @Column('text')
    body: string;

    @ManyToOne(
        () => Graph,
        graph => graph.notes,
        { onDelete: 'SET NULL', cascade: ['insert', 'update'] },
    )
    graph: Graph;

    @ManyToOne(
        () => User,
        user => user.notes,
        { onDelete: 'SET NULL', cascade: ['insert', 'update'] },
    )
    author: User;

    @OneToMany(
        () => Edge,
        edge => edge.target,
        { onDelete: 'CASCADE' },
    )
    asTarget: Edge[];

    @OneToMany(
        () => Edge,
        edge => edge.source,
        { onDelete: 'CASCADE' },
    )
    asSource: Edge[];
}
