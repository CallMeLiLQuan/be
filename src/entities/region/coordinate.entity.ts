import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Area } from './area.entity';
import { Land } from './land.entity';

export interface Point {
  lat: number;
  lng: number;
}

@Entity()
export class Coordinate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('json')
  polygon: [number, number][];

  @Column('json')
  center: Point;

  @Column({ type: 'int', default: 15 })
  zoom: number;

  @OneToOne(() => Area, area => area.coordinates, { nullable: true })
  area: Area;

  @OneToOne(() => Land, land => land.coordinate, { nullable: true })
  land: Land;
}

export interface CoordinateDto {
  polygon: [number, number][];
  center: Point;
  zoom: number;
}