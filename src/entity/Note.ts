import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToOne,
    // PrimaryColumn,
} from 'typeorm';

// import { Graph } from './Graph';
import { User } from './User';
import { Edge } from './Edge';

@Entity('notes')
export class Note {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', { length: 255 })
    title: string;

    @ManyToOne(
        type => {
            console.log('Note note', type);
            return User;
        },
        user => user.notes,
    )
    author: User;

    @OneToOne(
        () => Edge,
        edge => edge.target,
    )
    asTarget: Edge;

    @OneToOne(
        () => Edge,
        edge => edge.source,
    )
    asSource: Edge;
}
