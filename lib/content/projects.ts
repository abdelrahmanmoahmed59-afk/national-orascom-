export type Project = {
  slug: string
  titleEn: string
  titleAr: string
  categoryEn: string
  categoryAr: string
  locationEn: string
  locationAr: string
  year: string
  summaryEn: string
  summaryAr: string
  scopeEn: string[]
  scopeAr: string[]
  highlightsEn: string[]
  highlightsAr: string[]
  heroImageUrl: string
  galleryImageUrls: string[]
}

export const projects: Project[] = [
  {
    slug: "al-noor-residential-towers",
    titleEn: "Al Noor Residential Towers",
    titleAr: "أبراج النور السكنية",
    categoryEn: "Residential",
    categoryAr: "سكني",
    locationEn: "Kuwait City",
    locationAr: "مدينة الكويت",
    year: "2024",
    summaryEn: "A multi-tower residential development delivered with a focus on quality finishing and on-time handover.",
    summaryAr: "تطوير سكني متعدد الأبراج مع تركيز على جودة التشطيبات والتسليم في الموعد.",
    scopeEn: ["Structural works", "MEP installation", "Interior fit-out", "Testing & commissioning"],
    scopeAr: ["الأعمال الإنشائية", "تنفيذ أنظمة الميكانيكا والكهرباء والسباكة", "التشطيبات الداخلية", "الاختبارات والتشغيل التجريبي"],
    highlightsEn: ["Phased handover plan", "Premium interior packages", "On-site QA/QC checkpoints"],
    highlightsAr: ["خطة تسليم على مراحل", "حزم تشطيبات متميزة", "نقاط ضبط جودة في الموقع"],
    heroImageUrl: "/modern-corporate-building-kuwait-premium-architect.jpg",
    galleryImageUrls: [
      "/modern-corporate-building-kuwait-premium-architect.jpg",
      "/modern-corporate-office-building-kuwait.jpg",
      "/warehouse-inventory-premium-professional.jpg",
    ],
  },
  {
    slug: "national-logistics-hub",
    titleEn: "National Logistics Hub",
    titleAr: "مركز الخدمات اللوجستية الوطني",
    categoryEn: "Industrial",
    categoryAr: "صناعي",
    locationEn: "Mina Abdullah",
    locationAr: "ميناء عبدالله",
    year: "2023",
    summaryEn: "Warehousing and support facilities built for operational efficiency and safe material handling.",
    summaryAr: "مستودعات ومرافق مساندة تم تنفيذها لرفع الكفاءة التشغيلية وسلامة المناولة.",
    scopeEn: ["Civil works", "Steel structures", "External works", "Safety systems"],
    scopeAr: ["أعمال مدنية", "هياكل حديدية", "أعمال خارجية", "أنظمة السلامة"],
    highlightsEn: ["Optimized traffic flow", "Durable floor finishes", "HSE-focused site execution"],
    highlightsAr: ["انسيابية حركة داخلية محسّنة", "أرضيات عالية التحمل", "تنفيذ ميداني وفق متطلبات السلامة"],
    heroImageUrl: "/modern-industrial-warehouse-premium-aesthetic.jpg",
    galleryImageUrls: [
      "/modern-industrial-warehouse-premium-aesthetic.jpg",
      "/warehouse-logistics-boxes.jpg",
      "/modern-industrial-facility-aerial-view-premium.jpg",
    ],
  },
  {
    slug: "raya-medical-center-expansion",
    titleEn: "Raya Medical Center Expansion",
    titleAr: "توسعة مركز راية الطبي",
    categoryEn: "Healthcare",
    categoryAr: "رعاية صحية",
    locationEn: "Hawally",
    locationAr: "حولي",
    year: "2022",
    summaryEn: "A clinical expansion executed with careful coordination to reduce disruption to operations.",
    summaryAr: "توسعة طبية تم تنفيذها بتنسيق دقيق لتقليل تأثير الأعمال على التشغيل.",
    scopeEn: ["Fit-out", "MEP upgrades", "Fire & life safety", "Handover documentation"],
    scopeAr: ["تشطيبات", "ترقيات أنظمة الميكانيكا والكهرباء والسباكة", "السلامة من الحريق", "وثائق التسليم"],
    highlightsEn: ["Night-shift work windows", "Clean-site protocols", "Commissioning and handover pack"],
    highlightsAr: ["نوافذ عمل ليلية", "إجراءات موقع نظيف", "حزمة تشغيل وتسليم متكاملة"],
    heroImageUrl: "/modern-corporate-office-building-kuwait.jpg",
    galleryImageUrls: [
      "/modern-corporate-office-building-kuwait.jpg",
      "/technical-consulting-engineers.jpg",
      "/safety-equipment-helmets-and-gear.jpg",
    ],
  },
  {
    slug: "coastal-road-infrastructure",
    titleEn: "Coastal Road Infrastructure Package",
    titleAr: "حزمة أعمال البنية التحتية للطريق الساحلي",
    categoryEn: "Infrastructure",
    categoryAr: "بنية تحتية",
    locationEn: "Shuwaikh",
    locationAr: "الشويخ",
    year: "2021",
    summaryEn: "Infrastructure upgrades supporting traffic flow, drainage resilience, and safer access.",
    summaryAr: "ترقيات للبنية التحتية لتحسين انسيابية المرور ورفع كفاءة التصريف وتعزيز السلامة.",
    scopeEn: ["Earthworks", "Drainage", "Roadworks", "Signage & safety elements"],
    scopeAr: ["أعمال ترابية", "تصريف مياه", "أعمال طرق", "لوحات وإرشادات وعناصر سلامة"],
    highlightsEn: ["Phased traffic management", "Drainage capacity improvements", "Documented as-built package"],
    highlightsAr: ["إدارة حركة على مراحل", "تحسين سعة التصريف", "حزمة تسليم ومخططات As-Built"],
    heroImageUrl: "/modern-industrial-facility-aerial-view-premium.jpg",
    galleryImageUrls: [
      "/modern-industrial-facility-aerial-view-premium.jpg",
      "/warehouse-logistics-boxes.jpg",
      "/modern-industrial-warehouse-premium-aesthetic.jpg",
    ],
  },
]

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug) || null
}
