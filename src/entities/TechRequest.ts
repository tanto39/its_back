import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { TechRequestType } from './TechRequestType';
import { Car } from './Car';
import { User } from './User';

@Entity('tech_requests')
export class TechRequest {
  @PrimaryGeneratedColumn({ name: 'request_id' })
  request_id: number;

  @ManyToOne(() => TechRequestType)
  @JoinColumn({ name: 'request_type' })
  requestType: TechRequestType;

  @Column({ name: 'request_type', length: 10 })
  request_type: string;

  @ManyToOne(() => Car, car => car.techRequests)
  @JoinColumn({ name: 'car_id' })
  car: Car;

  @Column({ name: 'car_id' })
  car_id: number;

  @Column({ name: 'date_repair', type: 'date', nullable: true })
  date_repair: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'person' })
  person: User;

  @Column({ length: 1024, nullable: true })
  info: string;
}