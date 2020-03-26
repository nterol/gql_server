import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToOne,
    BaseEntity,
    // PrimaryColumn,
} from 'typeorm';

// import { Graph } from './Graph';
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
        { onDelete: 'SET NULL' },
    )
    graph: Graph;

    @ManyToOne(
        () => User,
        user => user.notes,
        { onDelete: 'SET NULL' },
    )
    author: User;

    @OneToOne(
        () => Edge,
        edge => edge.target,
        { onDelete: 'CASCADE' },
    )
    asTarget: Edge;

    @OneToOne(
        () => Edge,
        edge => edge.source,
        { onDelete: 'CASCADE' },
    )
    asSource: Edge;
}
