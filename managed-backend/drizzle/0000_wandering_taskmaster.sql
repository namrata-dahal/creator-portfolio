CREATE TABLE `inquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`brand` text NOT NULL,
	`website` text DEFAULT '' NOT NULL,
	`objective` text NOT NULL,
	`format` text NOT NULL,
	`budget` text NOT NULL,
	`platforms` text NOT NULL,
	`timeline` text NOT NULL,
	`usage` text NOT NULL,
	`details` text NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `inquiries_email_created_idx` ON `inquiries` (`email`,`created_at`);