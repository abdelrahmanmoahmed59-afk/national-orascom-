import { z } from "zod"

export const jobApplicationSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  jobSlug: z.string(),
  jobTitleEn: z.string(),
  jobTitleAr: z.string(),
  applicantName: z.string(),
  applicantEmail: z.string().email(),
  applicantPhone: z.string(),
})

export type JobApplication = z.infer<typeof jobApplicationSchema>

