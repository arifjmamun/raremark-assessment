import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { PropertyType } from './types/property-type.enum';

@Entity()
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'float', nullable: false })
  price: number;

  @Column({ type: 'simple-enum', nullable: false })
  type: PropertyType;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'simple-array', nullable: false })
  images: string[];

  @Column({ type: 'varchar', nullable: false })
  country: string;

  @Column({ type: 'varchar', nullable: false })
  city: string;

  @Column({ type: 'datetime', nullable: false })
  fromDate: Date;

  @Column({ type: 'datetime', nullable: false })
  toDate: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}