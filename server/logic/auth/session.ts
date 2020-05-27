// taken and (very lightly) adapted directly from connect-typeorm's docs
// this should not ever need to be messed with or tested
import { ISession } from "connect-typeorm";
import { Column, Entity, Index, PrimaryColumn } from "typeorm";

@Entity()
class Session implements ISession {
  @Index()
  @Column({
    type: "bigint",
    default: Date.now(),
  })
  expiredAt: number;

  @PrimaryColumn({
    type: "varchar",
    length: 255,
    default: "",
  })
  id: string;

  @Column({
    type: "text",
    default: "",
  })
  json: string;
}

export default Session;
