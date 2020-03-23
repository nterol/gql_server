import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    OneToOne,
} from 'typeorm';

import { User } from './User';
import { Note } from './Note';

@Entity('edges')
export class Edge {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', { length: 255 })
    title: string;

    @ManyToMany(
        () => User,
        user => user.edges,
    )
    author: User;

    @OneToOne(
        () => Note,
        note => note.asTarget,
    )
    target: Note;

    @OneToOne(
        () => Note,
        note => note.asSource,
    )
    source: Note;
}
