import {
  IsAlpha,
  IsLowercase,
  IsNotEmpty,
  validateOrReject,
} from "class-validator"
import {
  CreateDateColumn,
  Entity,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  ManyToMany,
  PrimaryColumn,
  UpdateEvent,
} from "typeorm"

import { Recipe } from "./recipe"

@Entity()
export class Tag {
  @PrimaryColumn({
    type: "varchar",
    length: 32,
  })
  @IsNotEmpty()
  @IsAlpha()
  @IsLowercase()
  name: string

  @CreateDateColumn()
  createdAt: Date

  @ManyToMany(() => Recipe, (recipe) => recipe.tags)
  recipes: Recipe[]
}

@EventSubscriber()
export class TagSubscriber implements EntitySubscriberInterface<Tag> {
  listenTo() {
    return Tag
  }

  async beforeInsert(event: InsertEvent<Tag>) {
    await validateOrReject(event.entity)
  }

  async beforeUpdate(event: UpdateEvent<Tag>) {
    const { entity } = event
    if (entity) {
      await validateOrReject(entity)
    }
  }
}
