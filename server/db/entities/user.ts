import { randomBytes, createHash } from "crypto";
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
  Column,
  OneToMany,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from "typeorm";
import {
  IsEmail,
  IsAlphanumeric,
  NotEquals,
  validateOrReject,
} from "class-validator";

import { Recipe } from "./recipe";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    length: 255,
    unique: true,
  })
  @IsEmail()
  email: string;

  @Column({
    type: "varchar",
    length: 32,
    unique: true,
  })
  @NotEquals("")
  @IsAlphanumeric()
  userName: string;

  @Column({
    type: "varchar",
    length: 128,
    select: false,
  })
  password: string;

  @Column({
    type: "varchar",
    length: 64,
    select: false,
  })
  salt: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @VersionColumn()
  version: number;

  @OneToMany(() => Recipe, (recipe) => recipe.user, { onDelete: "CASCADE" })
  recipes: Recipe[];

  static encryptPassword(plainTextPassword: string, salt: string) {
    return createHash("RSA-SHA256")
      .update(plainTextPassword)
      .update(salt)
      .digest("hex");
  }

  checkPassword(passwordAttempt: string) {
    return User.encryptPassword(passwordAttempt, this.salt) === this.password;
  }
}

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>) {
    const { entity } = event;
    await validateOrReject(entity);

    entity.salt = randomBytes(32).toString("base64");
    entity.password = User.encryptPassword(entity.password, entity.salt);
  }

  async beforeUpdate(event: UpdateEvent<User>) {
    const { entity } = event;
    await validateOrReject(entity);

    // indicates user changed their PW
    if (entity.password) {
      entity.salt = randomBytes(32).toString("base64");
      entity.password = User.encryptPassword(entity.password, entity.salt);
    }
  }
}
