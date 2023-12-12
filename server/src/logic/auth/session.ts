// taken and (very lightly) adapted directly from connect-typeorm's docs
// this should not ever need to be messed with or tested
import { ISession } from "connect-typeorm"
import { Column, DeleteDateColumn, Entity, Index, PrimaryColumn } from "typeorm"

@Entity()
export class Session implements ISession {
  @Index()
  @Column("bigint")
  public expiredAt = Date.now()

  @PrimaryColumn("varchar", { length: 255 })
  public id = ""

  @Column("text")
  public json = ""

  @DeleteDateColumn()
  public destroyedAt?: Date
}
