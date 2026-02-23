import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { TechRequest } from './TechRequest';

@Entity('tech_request_types')
export class TechRequestType {
  @PrimaryColumn({ name: 'request_type', length: 10 })
  request_type: string;

  @Column({ length: 32, nullable: true })
  name: string;

  @OneToMany(() => TechRequest, req => req.requestType)
  requests: TechRequest[];
}