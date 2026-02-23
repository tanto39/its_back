import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { User } from './User';

@Entity('roles')
export class Role {
  @PrimaryColumn({ name: 'role_name', length: 32 })
  role_name: string;

  @Column({ length: 32, nullable: true })
  description: string;

  @OneToMany(() => User, user => user.role)
  users: User[];
}