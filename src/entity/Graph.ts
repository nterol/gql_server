import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { User } from './User';

// import * as bcrypt from 'bcryptjs';

@Entity('graphs')
export class Graph {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', { length: 255 })
    title: string;

    @ManyToOne(
        type => {
            console.log('GRAPH TYPE', type);
            return User;
        },
        user => user.graphs,
    )
    author: User;
}
