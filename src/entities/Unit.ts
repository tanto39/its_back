import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Car } from './Car';

@Entity('units')
export class Unit {
  @PrimaryGeneratedColumn({ name: 'unit_id' })
  unit_id: number;

  @Column({ length: 32 })
  name: string;

  @ManyToOne(() => Car, car => car.units)
  @JoinColumn({ name: 'car_id' })
  car: Car;

  @Column({ name: 'car_id' })
  car_id: number;

  @Column({ name: 'date_repair', type: 'date', nullable: true })
  date_repair: Date;

  @Column({ type: 'int', nullable: true })
  its: number;

  @Column({ length: 1024, nullable: true })
  info: string;

  @Column({ name: 'image_url', length: 1024, nullable: true })
  image_url: string;
}