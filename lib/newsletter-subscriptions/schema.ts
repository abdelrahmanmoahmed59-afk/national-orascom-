import { z } from "zod"

export const newsletterSubscriptionSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  email: z.string().email(),
  sourcePath: z.string().optional(),
})

export type NewsletterSubscription = z.infer<typeof newsletterSubscriptionSchema>

