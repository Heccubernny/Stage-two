import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  userId!: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @Column({ unique: true })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @Column()
  @IsNotEmpty()
  password!: string;

  @Column({ nullable: true })
  phone!: string;
}
