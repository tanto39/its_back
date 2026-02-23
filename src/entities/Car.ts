import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './User';
import { Unit } from './Unit';
import { TechRequest } from './TechRequest';

@Entity('cars')
export class Car {
  @PrimaryGeneratedColumn({ name: 'car_id' })
  car_id: number;

  @Column({ length: 32 })
  name: string;

  @Column({ name: 'reg_number', length: 10, unique: true, nullable: true })
  reg_number: string;

  @Column({ name: 'date_tech', type: 'date', nullable: true })
  date_tech: Date;

  @Column({ name: 'date_repair', type: 'date', nullable: true })
  date_repair: Date;

  @Column({ type: 'int', nullable: true })
  milage: number;

  @Column({ type: 'int', nullable: true })
  its: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'person' })
  person: User;

  @Column({ length: 1024, nullable: true })
  info: string;

  @Column({ name: 'image_url', length: 1024, nullable: true })
  image_url: string;

  @OneToMany(() => Unit, unit => unit.car)
  units: Unit[];

  @OneToMany(() => TechRequest, req => req.car)
  techRequests: TechRequest[];
}