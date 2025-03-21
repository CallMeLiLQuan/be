import { Area } from './area.entity';
import { Owner } from './owner.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Coordinate } from './coordinate.entity';
import { Region } from './region.entity';

@Entity()
export class Land {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column('float')
  area: number;

  @Column('float')
  price: number;

  @Column()
  location: string;

  @Column('int')
  areaCount: number;

  @Column({ type: 'json', nullable: true })
  properties: {
    key: string;
    value: string | number | boolean;
  }[];

  @OneToOne(() => Coordinate, coordinate => coordinate.land, { cascade: true })
  @JoinColumn()
  coordinate: Coordinate;

  @OneToMany(() => Area, area => area.land, { cascade: true })
  areas: Area[];

  @ManyToOne(() => Owner, owner => owner.lands, { eager: true })
  @JoinColumn()
  owner: Owner;

  @ManyToOne(() => Region, region => region.lands)
  @JoinColumn()
  region: Region;

  @Column({ nullable: true })
  planningMapUrl: string;

  @Column({ nullable: true })
  googleMapUrl: string;
} 