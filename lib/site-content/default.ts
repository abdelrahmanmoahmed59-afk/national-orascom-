import type { SiteContent } from "./schema"

export const DEFAULT_SITE_CONTENT: SiteContent = {
  version: 1,
  branding: {
    companyName: { en: "National Orascom", ar: "ناشونال أوراسكوم" },
    tagline: { en: "Construction & Contracting", ar: "البناء والمقاولات" },
    logo: {
      src: "/logo%20national%20orascom%20company.png",
      alt: { en: "National Orascom", ar: "ناشونال أوراسكوم" },
    },
    favicon: {
      src: "/logo%20national%20orascom%20company.png",
    },
  },
  contact: {
    address: {
      en: "Kuwait City, Kuwait\nBusiness District to Shuwaikh, Kuwait",
      ar: "مدينة الكويت، الكويت\nمنطقة الأعمال إلى الشويخ، الكويت",
    },
    phone: "+965 9558 8251",
    email: "info@nationalorascom.com",
    hours: {
      en: "Sunday - Thursday: 8:00 AM - 5:00 PM",
      ar: "الأحد - الخميس: 8:00 صباحاً - 5:00 مساءً",
    },
    socials: [
      { id: "linkedin", type: "linkedin", url: "" },
      { id: "instagram", type: "instagram", url: "" },
      { id: "facebook", type: "facebook", url: "" },
      { id: "x", type: "x", url: "" },
    ],
  },
  clients: {
    title: { en: "Clients", ar: "العملاء" },
    subtitle: { en: "Trusted partnerships", ar: "شراكات موثوقة" },
    description: {
      en: "A selection of organizations we’ve supported across planning, execution, and handover.",
      ar: "نماذج لجهات قمنا بدعمها عبر مراحل التخطيط والتنفيذ والتسليم.",
    },
    highlights: {
      en: [
        "Clear scope definition and transparent reporting",
        "Safety-first execution and documented QA/QC",
        "Reliable coordination across stakeholders",
      ],
      ar: [
        "تحديد واضح لنطاق العمل وتقارير شفافة",
        "تنفيذ يضع السلامة أولاً وإجراءات جودة موثقة",
        "تنسيق موثوق بين جميع الأطراف",
      ],
    },
    items: [],
  },
  about: {
    excerptEn: "National Orascom delivers construction and contracting projects with a focus on safety and quality.",
    excerptAr: "تقدم ناشونال أوراسكوم مشاريع البناء والمقاولات مع التركيز على السلامة والجودة.",
    titleEn: "Built on delivery. Driven by quality.",
    titleAr: "نبني بالإنجاز ونقود بالجودة.",
    contentEn:
      "We partner with developers, operators, and consultants to deliver projects across the full lifecycle — from planning and mobilization to handover.",
    contentAr:
      "نعمل مع المطورين والمشغلين والاستشاريين لتسليم المشاريع عبر دورة المشروع كاملة — من التخطيط وتجهيز الموقع حتى التسليم.",
    missionEn: "Deliver projects safely, on time, and to a standard we stand behind.",
    missionAr: "تسليم المشاريع بأمان وفي الوقت المحدد وبمعيار نفخر به.",
    visionEn: "Be a trusted contracting partner known for dependable execution and lasting value.",
    visionAr: "أن نكون شريكاً موثوقاً في المقاولات معروفاً بالتنفيذ الموثوق والقيمة المستدامة.",
    industryEn: "Contracting services across residential, commercial, industrial, and infrastructure sectors.",
    industryAr: "خدمات المقاولات في قطاعات السكني والتجاري والصناعي والبنية التحتية.",
    customerEn: "Transparent communication and proactive coordination from start to handover.",
    customerAr: "تواصل واضح وتنسيق استباقي من البداية حتى التسليم.",
    imageUrl: "/modern-corporate-building-kuwait-premium-architect.jpg",
  },
  aboutStats: [],
  aboutValues: [],
  aboutMilestones: [],
  services: [],
  projects: [],
  careers: {
    applyEmail: "careers@nationalorascom.com",
    jobs: [],
  },
  policies: {
    intro: {
      en: "National Orascom is committed to protecting health, safety, and the environment across all project activities.",
      ar: "تلتزم ناشونال أوراسكوم بحماية الصحة والسلامة والبيئة في جميع أعمال المشروع.",
    },
    commitmentsEn: [],
    commitmentsAr: [],
  },
}
