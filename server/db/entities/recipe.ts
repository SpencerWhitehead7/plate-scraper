import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from "typeorm";
import { validateOrReject, IsNotEmpty, NotEquals } from "class-validator";

import { User } from "./user";
import { Tag } from "./tag";

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "text",
  })
  @IsNotEmpty()
  text: string; // the recipe itself

  @Column({
    type: "text",
  })
  @IsNotEmpty()
  title: string; // recipe's title

  @Column({
    type: "varchar",
    length: 64, // doubt I'll ever be supporting any sites with base urls longer than this
    default: "upload",
  })
  @NotEquals("")
  sourceSite: string; // site recipe was scraped from

  @Column({
    type: "text",
    default: "upload",
  })
  @NotEquals("")
  sourceUrl: string; // exact url recipe was scraped from

  @Column({
    type: "integer",
  })
  createdBy: number; // id of user who originally scraped/uploaded recipe

  @Column({
    type: "integer",
    default: 0,
  })
  forkedCount: number; // count of times others have forked recipe

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @VersionColumn()
  version: number;

  @Column({ type: "integer" })
  userId: number;
  @ManyToOne(() => User, (user) => user.recipes, { onDelete: "CASCADE" })
  user: User;

  @ManyToMany(() => Tag, (tag) => tag.recipes)
  // the recipe's rows in the join table are automatically deleted on delete of recipe
  // If possible, I'd like to delete any tags that are orphaned when a recipe is deleted, but this will probably involve a custom query, which should be implemented and tested as part of the delete recipe endpoint
  @JoinTable()
  tags: Tag[];
}

@EventSubscriber()
export class RecipeSubscriber implements EntitySubscriberInterface<Recipe> {
  listenTo() {
    return Recipe;
  }

  async beforeInsert(event: InsertEvent<Recipe>) {
    await validateOrReject(event.entity);
  }

  async beforeUpdate(event: UpdateEvent<Recipe>) {
    await validateOrReject(event.entity);
  }
}
