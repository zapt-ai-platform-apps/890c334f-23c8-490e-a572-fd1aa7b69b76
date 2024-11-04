import { pgTable, serial, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core';

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  reward: integer('reward').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const task_responses = pgTable('task_responses', {
  id: serial('id').primaryKey(),
  taskId: integer('task_id').notNull(),
  userId: uuid('user_id').notNull(),
  response: text('response'),
  completedAt: timestamp('completed_at').defaultNow(),
});

export const user_rewards = pgTable('user_rewards', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull(),
  totalRewards: integer('total_rewards').notNull().default(0),
  updatedAt: timestamp('updated_at').defaultNow(),
});