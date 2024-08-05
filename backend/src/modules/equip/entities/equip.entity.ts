import { Expose } from 'class-transformer';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Equip')
export class EquipEntity {
  @Expose()
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Expose()
  @Column({ type: 'varchar', nullable: false })
  equipmentId: string;

  @Expose()
  @Column({ type: 'datetime', nullable: false })
  timestamp: Date;

  @Expose()
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  value: number;

  @BeforeInsert()
  @BeforeUpdate()
  formatDates() {
    this.timestamp = new Date(this.timestamp);
  }
}
