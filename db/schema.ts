import { pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  userId: uuid("user_id").primaryKey().defaultRandom(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 255 }).notNull(),
});

export const organisations = pgTable("organisations", {
  orgId: uuid("org_id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
});

export const organisationUsers = pgTable("organisation_users", {
  orgId: uuid("org_id")
    .notNull()
    .references(() => organisations.orgId),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.userId),
});
