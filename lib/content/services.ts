export type Service = {
  id: string
  num: string
  titleEn: string
  titleAr: string
  descEn: string
  descAr: string
  imageUrl: string
}

export const services: Service[] = [
  {
    id: "general-contracting",
    num: "01",
    titleEn: "General Contracting",
    titleAr: "المقاولات العامة",
    descEn: "End-to-end delivery for commercial, residential, and industrial builds.",
    descAr: "تنفيذ متكامل لمشاريع البناء التجارية والسكنية والصناعية.",
    imageUrl: "/modern-corporate-building-kuwait-premium-architect.jpg",
  },
  {
    id: "civil-structural",
    num: "02",
    titleEn: "Civil & Structural Works",
    titleAr: "الأعمال المدنية والإنشائية",
    descEn: "Concrete, steel, and structural packages built with rigorous quality control.",
    descAr: "حزم خرسانية وحديدية وإنشائية بجودة صارمة وإشراف دقيق.",
    imageUrl: "/modern-industrial-facility-aerial-view-premium.jpg",
  },
  {
    id: "mep",
    num: "03",
    titleEn: "MEP Services",
    titleAr: "خدمات الميكانيكا والكهرباء والسباكة",
    descEn: "Design coordination and installation for mechanical, electrical, and plumbing systems.",
    descAr: "تنسيق التصميم وتنفيذ وتركيب أنظمة الميكانيكا والكهرباء والسباكة.",
    imageUrl: "/technical-consulting-engineers.jpg",
  },
  {
    id: "fit-out",
    num: "04",
    titleEn: "Interior Fit-Out",
    titleAr: "التشطيبات الداخلية",
    descEn: "High-end finishes for offices, retail, hospitality, and residential spaces.",
    descAr: "تشطيبات عالية الجودة للمكاتب والمتاجر والضيافة والمساحات السكنية.",
    imageUrl: "/modern-corporate-office-building-kuwait.jpg",
  },
  {
    id: "project-management",
    num: "05",
    titleEn: "Project Management",
    titleAr: "إدارة المشاريع",
    descEn: "Planning, scheduling, cost control, and stakeholder coordination across the project lifecycle.",
    descAr: "تخطيط وجدولة وضبط تكاليف وتنسيق أصحاب المصلحة طوال دورة المشروع.",
    imageUrl: "/warehouse-logistics-boxes.jpg",
  },
  {
    id: "hse-quality",
    num: "06",
    titleEn: "HSE & Quality Assurance",
    titleAr: "السلامة والجودة",
    descEn: "Safety-first execution with documented QA/QC procedures on site.",
    descAr: "تنفيذ يضع السلامة أولاً مع إجراءات موثقة لضمان الجودة ومراقبتها في الموقع.",
    imageUrl: "/safety-equipment-helmets-and-gear.jpg",
  },
]

