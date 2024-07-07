// src/entities/Organisation.ts
import { IsNotEmpty, IsString } from 'class-validator';
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class Organisation extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  orgId!: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @ManyToMany(() => User)
  @JoinTable()
  users!: User[];
}
