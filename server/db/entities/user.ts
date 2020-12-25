import {hash, compare} from "bcrypt";
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
  MaxLength,
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
    // bcrypt ouputs salted hashed pws that are exactly 60 char long
    length: 60,
    select: false,
  })
  // bcrypt only uses the first 72 chars
  // using 64 instead because it's nice and round and makes it less obvious I'm using bcrypt

  // validating here because the actual DB column only ever gets the 60 char bcrypt result
  // don't want users to have a >72 char password and then realize that as
  // long as they get the first 72 right they'll be able to log in even
  // if the rest is wrong, which would be pretty weird/unsettling

  // also prevents DDOS via people just submitting huge passwords
  // because the validator runs before the password is hashed
  @MaxLength(64)
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @VersionColumn()
  version: number;

  @OneToMany(() => Recipe, (recipe) => recipe.user, { onDelete: "CASCADE" })
  recipes: Recipe[];

  static encryptPassword(plainTextPassword: string) {
    return hash(plainTextPassword, 10)
  }
  
  checkPassword(passwordAttempt: string) {
    return compare(passwordAttempt, this.password);
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

    entity.password = await User.encryptPassword(entity.password)
  }

  async beforeUpdate(event: UpdateEvent<User>) {
    const { entity } = event;
    await validateOrReject(entity);

    // indicates user changed their PW
    if (entity.password) {
      entity.password = await User.encryptPassword(entity.password)
    }
  }
}
