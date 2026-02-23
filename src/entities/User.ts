import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Role } from './Role';
import { Car } from './Car';
import { TechRequest } from './TechRequest';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryColumn({ length: 32 })
  login: string;

  @Exclude() // исключаем при сериализации
  @Column({ length: 32 })
  password: string; // в реальном проекте хранить хеш!

  @Column({ name: 'second_name', length: 30, nullable: true })
  second_name: string;

  @Column({ name: 'first_name', length: 30, nullable: true })
  first_name: string;

  @Column({ name: 'middle_name', length: 30, nullable: true })
  middle_name: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_name' })
  role: Role;

  @Column({ name: 'role_name', length: 32 })
  role_name: string;

  @OneToMany(() => Car, car => car.person)
  cars: Car[];

  @OneToMany(() => TechRequest, req => req.person)
  techRequests: TechRequest[];
}