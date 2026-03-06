import { z } from "zod"

export const contactSubmissionSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string(),
  message: z.string(),
  sourcePath: z.string().optional(),
})

export type ContactSubmission = z.infer<typeof contactSubmissionSchema>

