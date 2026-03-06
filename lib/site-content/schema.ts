import { z } from "zod"

const localizedStringSchema = z.object({
  en: z.string(),
  ar: z.string(),
})

const brandingSchema = z.object({
  companyName: localizedStringSchema,
  tagline: localizedStringSchema,
  logo: z.object({
    src: z.string(),
    alt: localizedStringSchema,
  }),
  favicon: z.object({
    src: z.string(),
  }),
})

const socialTypeSchema = z.enum(["linkedin", "instagram", "facebook", "x", "youtube", "tiktok"])

const contactSchema = z.object({
  address: localizedStringSchema,
  phone: z.string(),
  email: z.string(),
  hours: localizedStringSchema,
  socials: z
    .array(
      z.object({
        id: z.string(),
        type: socialTypeSchema,
        url: z.string(),
      }),
    )
    .default([]),
})

const clientSchema = z.object({
  id: z.string(),
  name: localizedStringSchema,
  logoSrc: z.string(),
  websiteUrl: z.string().optional(),
})

const clientsSchema = z.object({
  title: localizedStringSchema,
  subtitle: localizedStringSchema,
  description: localizedStringSchema,
  highlights: z
    .object({
      en: z.array(z.string()).default([]),
      ar: z.array(z.string()).default([]),
    })
    .default({ en: [], ar: [] }),
  items: z.array(clientSchema).default([]),
})

const aboutSchema = z.object({
  excerptEn: z.string(),
  excerptAr: z.string(),
  titleEn: z.string(),
  titleAr: z.string(),
  contentEn: z.string(),
  contentAr: z.string(),
  missionEn: z.string(),
  missionAr: z.string(),
  visionEn: z.string(),
  visionAr: z.string(),
  industryEn: z.string(),
  industryAr: z.string(),
  customerEn: z.string(),
  customerAr: z.string(),
  imageUrl: z.string(),
})

const aboutStatSchema = z.object({
  value: z.number(),
  suffix: z.string().optional(),
  labelEn: z.string(),
  labelAr: z.string(),
})

const aboutValueSchema = z.object({
  titleEn: z.string(),
  titleAr: z.string(),
  descEn: z.string(),
  descAr: z.string(),
})

const aboutMilestoneSchema = z.object({
  year: z.string(),
  titleEn: z.string(),
  titleAr: z.string(),
})

const serviceSchema = z.object({
  id: z.string(),
  num: z.string(),
  titleEn: z.string(),
  titleAr: z.string(),
  descEn: z.string(),
  descAr: z.string(),
  imageUrl: z.string(),
})

const projectSchema = z.object({
  slug: z.string(),
  titleEn: z.string(),
  titleAr: z.string(),
  clientEn: z.string().default(""),
  clientAr: z.string().default(""),
  categoryEn: z.string(),
  categoryAr: z.string(),
  locationEn: z.string(),
  locationAr: z.string(),
  year: z.string(),
  amountKd: z.number().finite().nonnegative().optional(),
  statusEn: z.string().default(""),
  statusAr: z.string().default(""),
  summaryEn: z.string(),
  summaryAr: z.string(),
  detailsEn: z.string().optional(),
  detailsAr: z.string().optional(),
  scopeEn: z.array(z.string()),
  scopeAr: z.array(z.string()),
  highlightsEn: z.array(z.string()),
  highlightsAr: z.array(z.string()),
  heroImageUrl: z.string(),
  galleryImageUrls: z.array(z.string()),
})

const jobOpeningSchema = z.object({
  slug: z.string(),
  titleEn: z.string(),
  titleAr: z.string(),
  locationEn: z.string(),
  locationAr: z.string(),
  typeEn: z.string(),
  typeAr: z.string(),
  summaryEn: z.string(),
  summaryAr: z.string(),
  responsibilitiesEn: z.array(z.string()),
  responsibilitiesAr: z.array(z.string()),
  requirementsEn: z.array(z.string()),
  requirementsAr: z.array(z.string()),
})

const careersSchema = z.object({
  applyEmail: z.string(),
  jobs: z.array(jobOpeningSchema).default([]),
})

const policiesSchema = z.object({
  intro: localizedStringSchema,
  commitmentsEn: z.array(z.string()).default([]),
  commitmentsAr: z.array(z.string()).default([]),
})

export const siteContentSchema = z
  .object({
    version: z.literal(1),
    branding: brandingSchema,
    contact: contactSchema,
    clients: clientsSchema,
    about: aboutSchema,
    aboutStats: z.array(aboutStatSchema).default([]),
    aboutValues: z.array(aboutValueSchema).default([]),
    aboutMilestones: z.array(aboutMilestoneSchema).default([]),
    services: z.array(serviceSchema).default([]),
    projects: z.array(projectSchema).default([]),
    careers: careersSchema,
    policies: policiesSchema,
  })
  .passthrough()

export type SiteContent = z.infer<typeof siteContentSchema>
export type LocalizedString = z.infer<typeof localizedStringSchema>
export type ClientItem = z.infer<typeof clientSchema>
export type ProjectItem = z.infer<typeof projectSchema>
export type ServiceItem = z.infer<typeof serviceSchema>
export type JobOpeningItem = z.infer<typeof jobOpeningSchema>
