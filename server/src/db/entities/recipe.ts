import { IsNotEmpty, NotEquals, validateOrReject } from "class-validator"
import {
  Column,
  CreateDateColumn,
  Entity,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  UpdateEvent,
  VersionColumn,
} from "typeorm"

import { Tag } from "./tag"
import { User } from "./user"

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: "text",
  })
  @IsNotEmpty()
  text: string // the recipe itself

  @Column({
    type: "text",
  })
  @IsNotEmpty()
  title: string // recipe's title

  @Column({
    type: "varchar",
    length: 64, // doubt I'll ever be supporting any sites with base urls longer than this
    default: "upload",
  })
  @NotEquals("")
  sourceSite: string // site recipe was scraped from

  @Column({
    type: "text",
    default: "upload",
  })
  @NotEquals("")
  sourceUrl: string // exact url recipe was scraped from

  @Column({
    type: "integer",
  })
  createdBy: number // id of user who originally scraped/uploaded recipe

  @Column({
    type: "integer",
    default: 0,
  })
  forkedCount: number // count of times others have forked recipe

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @VersionColumn()
  version: number

  @Column({ type: "integer" })
  userId: number
  @ManyToOne(() => User, (user) => user.recipes, { onDelete: "CASCADE" })
  user: User

  @ManyToMany(() => Tag, (tag) => tag.recipes)
  // the recipe's rows in the join table are automatically deleted on delete of recipe
  @JoinTable()
  tags: Tag[]
}

@EventSubscriber()
export class RecipeSubscriber implements EntitySubscriberInterface<Recipe> {
  listenTo() {
    return Recipe
  }

  async beforeInsert(event: InsertEvent<Recipe>) {
    await validateOrReject(event.entity)
  }

  async beforeUpdate(event: UpdateEvent<Recipe>) {
    const { entity } = event
    if (entity) {
      await validateOrReject(entity)
    }
  }
}
