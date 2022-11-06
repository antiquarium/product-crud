import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  Id: string;

  @Column()
  Name: string;

  @Column({ type: 'numeric' })
  Price: number;

  @UpdateDateColumn()
  UpdateDate: Date;
}
