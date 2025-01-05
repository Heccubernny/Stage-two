import { pgTable, serial, text, uniqueIndex } from "drizzle-orm/pg-core";

export const UsersTable = pgTable(
  "users",
  {
    id: serial("id").primaryKey(), //use uuid
    firstNname: text("firstName").notNull(),
    lastName: text("lastName").notNull(),

    email: text("email").notNull(),
    password: text("password").notNull(),
    phone: text("phone"),
  },
  (users) => {
    return {
      uniqueIdx: uniqueIndex("unique_idx").on(users.email),
    };
  }
);
