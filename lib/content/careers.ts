export type JobOpening = {
  slug: string
  titleEn: string
  titleAr: string
  locationEn: string
  locationAr: string
  typeEn: string
  typeAr: string
  summaryEn: string
  summaryAr: string
  responsibilitiesEn: string[]
  responsibilitiesAr: string[]
  requirementsEn: string[]
  requirementsAr: string[]
}

export const jobOpenings: JobOpening[] = [
  {
    slug: "project-engineer",
    titleEn: "Project Engineer",
    titleAr: "مهندس مشروع",
    locationEn: "On-site",
    locationAr: "في الموقع",
    typeEn: "Full-time",
    typeAr: "دوام كامل",
    summaryEn: "Support project delivery across planning, coordination, and site execution.",
    summaryAr: "دعم تنفيذ المشاريع عبر التخطيط والتنسيق وإدارة الأعمال الميدانية.",
    responsibilitiesEn: [
      "Coordinate with site teams, subcontractors, and suppliers.",
      "Track progress against schedule and raise risks early.",
      "Prepare RFIs, method statements, and daily reports.",
    ],
    responsibilitiesAr: [
      "التنسيق مع فرق الموقع والمقاولين الفرعيين والموردين.",
      "متابعة تقدم الأعمال مقارنة بالبرنامج وإدارة المخاطر مبكراً.",
      "إعداد طلبات الاستفسار وخطط العمل والتقارير اليومية.",
    ],
    requirementsEn: [
      "Bachelor’s degree in Civil/Mechanical/Electrical Engineering.",
      "Strong communication and documentation skills.",
      "Experience in construction projects preferred.",
    ],
    requirementsAr: [
      "درجة بكالوريوس في الهندسة المدنية/الميكانيكية/الكهربائية.",
      "مهارات تواصل وتوثيق قوية.",
      "يفضل وجود خبرة سابقة في مشاريع البناء.",
    ],
  },
  {
    slug: "site-supervisor",
    titleEn: "Site Supervisor",
    titleAr: "مشرف موقع",
    locationEn: "On-site",
    locationAr: "في الموقع",
    typeEn: "Full-time",
    typeAr: "دوام كامل",
    summaryEn: "Lead day-to-day site activities with a focus on safety, quality, and productivity.",
    summaryAr: "قيادة الأعمال اليومية في الموقع مع التركيز على السلامة والجودة والإنتاجية.",
    responsibilitiesEn: [
      "Supervise workmanship and ensure compliance with drawings/specs.",
      "Coordinate daily tasks and manage site logistics.",
      "Enforce HSE rules and report incidents/near misses.",
    ],
    responsibilitiesAr: [
      "الإشراف على جودة التنفيذ والالتزام بالمخططات والمواصفات.",
      "تنسيق مهام اليوم وإدارة لوجستيات الموقع.",
      "تطبيق قواعد السلامة والإبلاغ عن الحوادث والملاحظات.",
    ],
    requirementsEn: [
      "5+ years of experience in construction supervision.",
      "Ability to read drawings and coordinate trades.",
      "Strong leadership and reporting skills.",
    ],
    requirementsAr: [
      "خبرة 5 سنوات أو أكثر في الإشراف بالمشاريع.",
      "القدرة على قراءة المخططات وتنسيق الأعمال.",
      "مهارات قيادة وإعداد تقارير قوية.",
    ],
  },
  {
    slug: "quantity-surveyor",
    titleEn: "Quantity Surveyor",
    titleAr: "حاسب كميات",
    locationEn: "Office / Site",
    locationAr: "المكتب / الموقع",
    typeEn: "Full-time",
    typeAr: "دوام كامل",
    summaryEn: "Manage measurements, cost tracking, and subcontractor valuations.",
    summaryAr: "إدارة القياسات وتتبع التكاليف واعتمادات المقاولين الفرعيين.",
    responsibilitiesEn: [
      "Prepare BOQs, take-offs, and interim valuations.",
      "Support cost reporting and change management.",
      "Coordinate with procurement and project teams.",
    ],
    responsibilitiesAr: [
      "إعداد جداول الكميات والحصر واعتمادات الدفعات.",
      "دعم تقارير التكاليف وإدارة التغييرات.",
      "التنسيق مع المشتريات وفرق المشاريع.",
    ],
    requirementsEn: [
      "Bachelor’s degree in Quantity Surveying/Civil Engineering or equivalent.",
      "Strong Excel and reporting skills.",
      "Experience with claims/variations is a plus.",
    ],
    requirementsAr: [
      "درجة بكالوريوس في هندسة/حاسب كميات أو ما يعادلها.",
      "مهارات قوية في Excel وإعداد التقارير.",
      "يفضل وجود خبرة في المطالبات والتغييرات.",
    ],
  },
  {
    slug: "hse-officer",
    titleEn: "HSE Officer",
    titleAr: "مسؤول سلامة (HSE)",
    locationEn: "On-site",
    locationAr: "في الموقع",
    typeEn: "Full-time",
    typeAr: "دوام كامل",
    summaryEn: "Drive a safety-first culture across site operations and audits.",
    summaryAr: "تعزيز ثقافة السلامة عبر أعمال الموقع والتفتيش والتدقيق.",
    responsibilitiesEn: [
      "Conduct toolbox talks, inspections, and audits.",
      "Support risk assessments and method statement reviews.",
      "Maintain safety records and HSE reporting.",
    ],
    responsibilitiesAr: [
      "تنفيذ اجتماعات السلامة اليومية والتفتيش والتدقيق.",
      "دعم تقييم المخاطر ومراجعة خطط العمل.",
      "إدارة سجلات السلامة والتقارير الخاصة بها.",
    ],
    requirementsEn: [
      "NEBOSH/IOSH or equivalent certification preferred.",
      "Experience in construction HSE required.",
      "Strong communication and training skills.",
    ],
    requirementsAr: [
      "يفضل الحصول على شهادات NEBOSH/IOSH أو ما يعادلها.",
      "خبرة مطلوبة في سلامة مواقع البناء.",
      "مهارات تواصل وتدريب قوية.",
    ],
  },
]

