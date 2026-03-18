import { pgTable, uuid, text, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const stakeholderCategoryEnum = pgEnum("stakeholder_category", [
  "accompagnateurs",
  "equipe",
  "utilisateurs_clients",
  "financeurs",
  "partenaires",
  "ecosysteme",
]);

export const stakeholderPriorityEnum = pgEnum("stakeholder_priority", [
  "critique",
  "important",
  "secondaire",
]);

export const biasNameEnum = pgEnum("bias_name", [
  "ancrage",
  "confirmation",
  "preuve_sociale",
  "aversion_perte",
  "statu_quo",
  "halo",
  "rarete",
  "reciprocite",
]);

// Tables
export const startups = pgTable("startups", {
  id: uuid("id").defaultRandom().primaryKey(),
  accessCode: text("access_code").unique().notNull(),
  startupName: text("startup_name").notNull(),
  password: text("password").notNull().default(""),
  sector: text("sector"),
  stage: text("stage"),
  founderName: text("founder_name").notNull(),
  module1Complete: boolean("module1_complete").default(false).notNull(),
  module2Complete: boolean("module2_complete").default(false).notNull(),
  module3Complete: boolean("module3_complete").default(false).notNull(),
  module4Complete: boolean("module4_complete").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const stakeholders = pgTable("stakeholders", {
  id: uuid("id").defaultRandom().primaryKey(),
  startupId: uuid("startup_id")
    .notNull()
    .references(() => startups.id, { onDelete: "cascade" }),
  category: stakeholderCategoryEnum("category").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default(""),
  priority: stakeholderPriorityEnum("priority").notNull().default("secondaire"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const biasApplications = pgTable("bias_applications", {
  id: uuid("id").defaultRandom().primaryKey(),
  stakeholderId: uuid("stakeholder_id")
    .notNull()
    .references(() => stakeholders.id, { onDelete: "cascade" }),
  biasName: biasNameEnum("bias_name").notNull(),
  application: text("application").notNull().default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const stakeholderMatrix = pgTable("stakeholder_matrix", {
  id: uuid("id").defaultRandom().primaryKey(),
  stakeholderId: uuid("stakeholder_id")
    .notNull()
    .references(() => stakeholders.id, { onDelete: "cascade" }),
  apparentStake: text("apparent_stake").notNull().default(""),
  deepStake: text("deep_stake").notNull().default(""),
  bridge: text("bridge").notNull().default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const quizResponses = pgTable("quiz_responses", {
  id: uuid("id").defaultRandom().primaryKey(),
  startupId: uuid("startup_id")
    .notNull()
    .references(() => startups.id, { onDelete: "cascade" }),
  questionId: text("question_id").notNull(),
  selectedAnswer: text("selected_answer").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const startupsRelations = relations(startups, ({ many }) => ({
  stakeholders: many(stakeholders),
  quizResponses: many(quizResponses),
}));

export const stakeholdersRelations = relations(stakeholders, ({ one, many }) => ({
  startup: one(startups, {
    fields: [stakeholders.startupId],
    references: [startups.id],
  }),
  biasApplications: many(biasApplications),
  matrix: many(stakeholderMatrix),
}));

export const biasApplicationsRelations = relations(biasApplications, ({ one }) => ({
  stakeholder: one(stakeholders, {
    fields: [biasApplications.stakeholderId],
    references: [stakeholders.id],
  }),
}));

export const stakeholderMatrixRelations = relations(stakeholderMatrix, ({ one }) => ({
  stakeholder: one(stakeholders, {
    fields: [stakeholderMatrix.stakeholderId],
    references: [stakeholders.id],
  }),
}));

export const quizResponsesRelations = relations(quizResponses, ({ one }) => ({
  startup: one(startups, {
    fields: [quizResponses.startupId],
    references: [startups.id],
  }),
}));

// Type exports
export type Startup = typeof startups.$inferSelect;
export type NewStartup = typeof startups.$inferInsert;
export type Stakeholder = typeof stakeholders.$inferSelect;
export type NewStakeholder = typeof stakeholders.$inferInsert;
export type BiasApplication = typeof biasApplications.$inferSelect;
export type StakeholderMatrixEntry = typeof stakeholderMatrix.$inferSelect;
export type QuizResponse = typeof quizResponses.$inferSelect;
