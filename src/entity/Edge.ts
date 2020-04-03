import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    ManyToOne,
} from 'typeorm';

import { User } from './User';
import { Note } from './Note';
import { Graph } from './Graph';

@Entity('edges')
export class Edge extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', { length: 255 })
    title: string;

    @ManyToOne(
        () => User,
        user => user.edges,
        { onDelete: 'SET NULL' },
    )
    author: User;

    @ManyToOne(
        () => Graph,
        graph => graph.edges,
        { onDelete: 'SET NULL' },
    )
    graph: Graph;

    @ManyToOne(
        () => Note,
        note => note.asTarget,
        { onDelete: 'SET NULL' },
    )
    target: Note;

    @ManyToOne(
        () => Note,
        note => note.asSource,
        { onDelete: 'SET NULL' },
    )
    source: Note;
}
