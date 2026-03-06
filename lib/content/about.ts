export type AboutStat = { value: number; suffix?: string; labelEn: string; labelAr: string }
export type AboutValue = { titleEn: string; titleAr: string; descEn: string; descAr: string }
export type AboutMilestone = { year: string; titleEn: string; titleAr: string }

export const aboutContent = {
  excerptEn:
    "National Orascom delivers construction and contracting projects with a focus on safety, quality, and reliable execution.",
  excerptAr:
    "تقدم ناشونال أوراسكوم مشاريع البناء والمقاولات مع التركيز على السلامة والجودة والتنفيذ الموثوق.",
  titleEn: "Built on delivery. Driven by quality.",
  titleAr: "نبني بالإنجاز ونقود بالجودة.",
  contentEn:
    "We partner with developers, operators, and consultants to deliver projects across the full lifecycle — from planning and mobilization to handover. Our teams combine disciplined project management with strong site leadership to meet schedule, budget, and quality requirements.",
  contentAr:
    "نعمل مع المطورين والمشغلين والاستشاريين لتسليم المشاريع عبر دورة المشروع كاملة — من التخطيط وتجهيز الموقع حتى التسليم. تجمع فرقنا بين إدارة مشاريع منضبطة وقيادة ميدانية قوية لتحقيق متطلبات الوقت والتكلفة والجودة.",
  missionEn: "Deliver projects safely, on time, and to a standard we stand behind.",
  missionAr: "تسليم المشاريع بأمان وفي الوقت المحدد وبمعيار نفخر به.",
  visionEn: "Be a trusted contracting partner known for dependable execution and lasting value.",
  visionAr: "أن نكون شريكاً موثوقاً في المقاولات معروفاً بالتنفيذ الموثوق والقيمة المستدامة.",
  industryEn:
    "We focus on contracting services across residential, commercial, industrial, and infrastructure sectors.",
  industryAr:
    "نركز على خدمات المقاولات في قطاعات السكني والتجاري والصناعي والبنية التحتية.",
  customerEn:
    "We prioritize transparent communication, proactive coordination, and clear documentation from start to handover.",
  customerAr:
    "نضع التواصل الواضح والتنسيق الاستباقي والتوثيق المنظم في صميم عملنا من البداية حتى التسليم.",
  imageUrl: "/modern-corporate-building-kuwait-premium-architect.jpg",
}

export const aboutStats: AboutStat[] = [
  { value: 15, suffix: "+", labelEn: "Years of Delivery", labelAr: "سنوات من الإنجاز" },
  { value: 120, suffix: "+", labelEn: "Projects Supported", labelAr: "مشروع تم دعمه" },
  { value: 300, suffix: "+", labelEn: "Team Members", labelAr: "عضو فريق" },
  { value: 0, suffix: "", labelEn: "Compromise on Safety", labelAr: "تنازل عن السلامة" },
]

export const aboutValues: AboutValue[] = [
  {
    titleEn: "Safety First",
    titleAr: "السلامة أولاً",
    descEn: "We plan, brief, and execute with HSE embedded in every activity.",
    descAr: "نخطط وننفذ مع تضمين السلامة في كل نشاط.",
  },
  {
    titleEn: "Quality Delivery",
    titleAr: "جودة التنفيذ",
    descEn: "Clear QA/QC checkpoints and disciplined site supervision.",
    descAr: "نقاط ضبط جودة واضحة وإشراف ميداني منضبط.",
  },
  {
    titleEn: "Reliable Coordination",
    titleAr: "تنسيق موثوق",
    descEn: "Proactive communication with all stakeholders to keep work moving.",
    descAr: "تواصل استباقي مع جميع الأطراف لضمان تقدم الأعمال.",
  },
  {
    titleEn: "Accountability",
    titleAr: "المسؤولية",
    descEn: "We own outcomes — schedule, cost, and quality — with transparent reporting.",
    descAr: "نلتزم بالنتائج — الوقت والتكلفة والجودة — بتقارير واضحة.",
  },
]

export const aboutMilestones: AboutMilestone[] = [
  { year: "2012", titleEn: "Expanded contracting capabilities", titleAr: "توسيع قدرات المقاولات" },
  { year: "2016", titleEn: "Scaled multi-site operations", titleAr: "توسيع عمليات متعددة المواقع" },
  { year: "2020", titleEn: "Strengthened HSE programs", titleAr: "تعزيز برامج السلامة" },
  { year: "2024", titleEn: "Delivered complex project packages", titleAr: "تسليم حزم مشاريع معقدة" },
]

