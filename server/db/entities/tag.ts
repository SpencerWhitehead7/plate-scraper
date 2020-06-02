import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
  Column,
  ManyToMany,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from "typeorm";
import {
  validateOrReject,
  IsNotEmpty,
  IsAlpha,
  IsLowercase,
} from "class-validator";

import { Recipe } from "./recipe";

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    length: 32,
    unique: true,
  })
  @IsNotEmpty()
  @IsAlpha()
  @IsLowercase()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @VersionColumn()
  version: number;

  @ManyToMany(() => Recipe, (recipe) => recipe.tags)
  recipes: Recipe[];
}

@EventSubscriber()
export class TagSubscriber implements EntitySubscriberInterface<Tag> {
  listenTo() {
    return Tag;
  }

  async beforeInsert(event: InsertEvent<Tag>) {
    await validateOrReject(event.entity);
  }

  async beforeUpdate(event: UpdateEvent<Tag>) {
    await validateOrReject(event.entity);
  }
}
