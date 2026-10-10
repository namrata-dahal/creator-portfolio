import {sqliteTable,text,integer,index} from 'drizzle-orm/sqlite-core';
export const inquiries=sqliteTable('inquiries',{
 id:text('id').primaryKey(),name:text('name').notNull(),email:text('email').notNull(),brand:text('brand').notNull(),website:text('website').notNull().default(''),objective:text('objective').notNull(),format:text('format').notNull(),budget:text('budget').notNull(),platforms:text('platforms').notNull(),timeline:text('timeline').notNull(),usage:text('usage').notNull(),details:text('details').notNull(),status:text('status').notNull().default('new'),createdAt:integer('created_at').notNull(),
},t=>[index('inquiries_email_created_idx').on(t.email,t.createdAt)]);
