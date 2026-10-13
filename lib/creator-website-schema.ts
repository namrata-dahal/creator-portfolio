import { z } from "zod";

export const creatorTypes = [
  "Content creator",
  "Photographer / videographer",
  "Designer / freelancer",
  "Student creator",
  "Other",
] as const;

export const creatorWebsiteSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.string().trim().email("Enter a valid email.").max(254)
    .transform((v) => v.toLowerCase()),
  handle: z.string().trim().min(2, "Add a creator handle or profile name.").max(120),
  creatorType: z.enum(creatorTypes),
  workUrl: z.string().trim().max(300).refine(
    (url) => !url || /^https?:\/\/[^\s]+$/i.test(url),
    "Use a complete link starting with https://.",
  ),
  notes: z.string().trim().max(1500),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Please agree to the privacy notice." }),
  }),
});

export type CreatorWebsiteInput = z.infer<typeof creatorWebsiteSchema>;
