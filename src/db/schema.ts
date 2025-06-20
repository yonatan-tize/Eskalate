import { pgTable, text, timestamp, uuid, varchar, pgEnum } from 'drizzle-orm/pg-core';

export const userRole = pgEnum('user_role', ['applicant', 'company']);
export const applicationStatus = pgEnum('application_status', ['Applied', 'Reviewed', 'Interview', 'Rejected', 'Hired']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: text('password').notNull(),
  role: userRole('role').notNull(),
});

export const jobs = pgTable('jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  location: varchar('location', { length: 255 }),
  createdBy: uuid('created_by').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const applications = pgTable('applications', {
  id: uuid('id').primaryKey().defaultRandom(),
  applicantId: uuid('applicant_id').references(() => users.id).notNull(),
  jobId: uuid('job_id').references(() => jobs.id).notNull(),
  resumeLink: text('resume_link').notNull(),
  coverLetter: text('cover_letter'),
  status: applicationStatus('status').notNull(),
  appliedAt: timestamp('applied_at').defaultNow().notNull(),
});
