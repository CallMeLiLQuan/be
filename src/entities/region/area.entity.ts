import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Land } from './land.entity';
import { Asset } from './asset.entity';
import { Coordinate } from './coordinate.entity';
import { Employee } from '../employee/employee.entity';
import { Task } from '../task/task.entity';
import { AreaClassification } from '../../area/enums/area-classification.enum';

@Entity()
export class Area {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  areaName: string;

  @Column()
  landPlot: string;

  @Column()
  status: 'available' | 'in-use' | 'pending';

  @Column('float')
  area: number;

  @Column()
  usage: string;

  @Column({
    type: 'enum',
    enum: AreaClassification,
    default: AreaClassification.OTHER
  })
  classification: AreaClassification;

  @ManyToOne(() => Land, (land) => land.areas)
  @JoinColumn()
  land: Land;

  @OneToOne(() => Coordinate, (coordinate) => coordinate.area, {
    cascade: true,
    eager: true
  })
  @JoinColumn()
  coordinates: Coordinate;

  @OneToMany(() => Employee, (employee) => employee.area)
  employees: Employee[];

  @OneToMany(() => Asset, (asset) => asset.area)
  assets: Asset[];

  @OneToMany(() => Task, (task) => task.area)
  tasks: Task[];

  landId: number;
}
