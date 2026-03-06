import { jobOpenings } from "@/lib/content/careers"
import { projects } from "@/lib/content/projects"
import { services } from "@/lib/content/services"

export type SearchItemType = "page" | "service" | "project" | "career" | "info"

export interface SearchItem {
  id: string
  title: {
    en: string
    ar: string
  }
  description: {
    en: string
    ar: string
  }
  keywords: {
    en: string[]
    ar: string[]
  }
  href: string
  type: SearchItemType
}

const pageItems: SearchItem[] = [
  {
    id: "home",
    title: { en: "Home", ar: "الرئيسية" },
    description: { en: "National Orascom — Construction & Contracting", ar: "ناشونال أوراسكوم — البناء والمقاولات" },
    keywords: { en: ["home", "national orascom", "construction", "contracting"], ar: ["الرئيسية", "ناشونال أوراسكوم", "بناء", "مقاولات"] },
    href: "/",
    type: "page",
  },
  {
    id: "about",
    title: { en: "About", ar: "من نحن" },
    description: { en: "Who we are and how we work", ar: "من نحن وكيف نعمل" },
    keywords: { en: ["about", "company", "mission", "vision"], ar: ["من نحن", "الشركة", "المهمة", "الرؤية"] },
    href: "/about",
    type: "page",
  },
  {
    id: "services",
    title: { en: "Services", ar: "الخدمات" },
    description: { en: "Construction and contracting capabilities", ar: "قدراتنا في البناء والمقاولات" },
    keywords: { en: ["services", "contracting", "mep", "fit-out"], ar: ["الخدمات", "مقاولات", "MEP", "تشطيبات"] },
    href: "/services",
    type: "page",
  },
  {
    id: "projects",
    title: { en: "Projects", ar: "المشاريع" },
    description: { en: "Project portfolio and highlights", ar: "محفظة المشاريع وأبرز الأعمال" },
    keywords: { en: ["projects", "portfolio", "work"], ar: ["مشاريع", "أعمال", "محفظة"] },
    href: "/projects",
    type: "page",
  },
  {
    id: "clients",
    title: { en: "Clients", ar: "العملاء" },
    description: { en: "Clients and partnerships", ar: "العملاء والشراكات" },
    keywords: { en: ["clients", "partners", "partnerships"], ar: ["العملاء", "شركاء", "شراكات"] },
    href: "/clients",
    type: "page",
  },
  {
    id: "careers",
    title: { en: "Careers", ar: "الوظائف" },
    description: { en: "Open positions and how to apply", ar: "الوظائف المتاحة وطريقة التقديم" },
    keywords: { en: ["careers", "jobs", "hiring"], ar: ["وظائف", "توظيف", "فرص"] },
    href: "/careers",
    type: "page",
  },
  {
    id: "contact",
    title: { en: "Contact", ar: "اتصل بنا" },
    description: { en: "Talk to our team", ar: "تواصل مع فريقنا" },
    keywords: { en: ["contact", "phone", "email"], ar: ["اتصل", "هاتف", "بريد"] },
    href: "/contact",
    type: "page",
  },
  {
    id: "policies",
    title: { en: "Policies", ar: "السياسات" },
    description: { en: "HSE and company policies", ar: "سياسات السلامة وسياسات الشركة" },
    keywords: { en: ["policies", "hse", "safety"], ar: ["سياسات", "سلامة", "HSE"] },
    href: "/policies",
    type: "page",
  },
]

const serviceItems: SearchItem[] = services.map((service) => ({
  id: `service-${service.id}`,
  title: { en: service.titleEn, ar: service.titleAr },
  description: { en: service.descEn, ar: service.descAr },
  keywords: {
    en: ["service", "contracting", "construction", service.titleEn.toLowerCase()],
    ar: ["خدمة", "مقاولات", "بناء", service.titleAr],
  },
  href: "/services",
  type: "service",
}))

const projectItems: SearchItem[] = projects.map((project) => ({
  id: `project-${project.slug}`,
  title: { en: project.titleEn, ar: project.titleAr },
  description: { en: project.summaryEn, ar: project.summaryAr },
  keywords: {
    en: ["project", project.categoryEn.toLowerCase(), project.locationEn.toLowerCase()],
    ar: ["مشروع", project.categoryAr, project.locationAr],
  },
  href: `/projects/${project.slug}`,
  type: "project",
}))

const careerItems: SearchItem[] = jobOpenings.map((job) => ({
  id: `career-${job.slug}`,
  title: { en: job.titleEn, ar: job.titleAr },
  description: { en: job.summaryEn, ar: job.summaryAr },
  keywords: {
    en: ["career", "job", job.typeEn.toLowerCase()],
    ar: ["وظيفة", "توظيف", job.typeAr],
  },
  href: `/careers#${job.slug}`,
  type: "career",
}))

export const searchData: SearchItem[] = [...pageItems, ...serviceItems, ...projectItems, ...careerItems]

export function searchItems(query: string, language: "en" | "ar"): SearchItem[] {
  const normalizedQuery = query.toLowerCase().trim()
  if (!normalizedQuery) return []

  return searchData.filter((item) => {
    const title = item.title[language].toLowerCase()
    const description = item.description[language].toLowerCase()
    const keywords = item.keywords[language].map((k) => k.toLowerCase())

    return (
      title.includes(normalizedQuery) ||
      description.includes(normalizedQuery) ||
      keywords.some((k) => k.includes(normalizedQuery))
    )
  })
}
