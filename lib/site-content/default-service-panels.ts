import type { ServiceFeaturePanelItem } from "./schema"

export const DEFAULT_SERVICE_FEATURE_PANELS: ServiceFeaturePanelItem[] = [
  {
    id: "service-panel-01",
    number: "01",
    titleEn: "General Construction & Allied Services",
    titleAr: "المقاولات العامة والخدمات المساندة",
    descriptionEn:
      "Integrated construction delivery for buildings, fit-out packages, and support trades managed under one coordinated team.",
    descriptionAr: "تنفيذ إنشائي متكامل للمباني وحزم التشطيبات والأعمال المساندة ضمن فريق واحد منسق.",
    offersEn: [
      "Main contracting and site execution",
      "Structural, finishing, and allied trade packages",
      "MEP coordination and handover support",
      "Quality, safety, and schedule control",
    ],
    offersAr: [
      "أعمال المقاولات الرئيسية والتنفيذ بالموقع",
      "الحزم الإنشائية والتشطيبات والأعمال المساندة",
      "تنسيق أعمال الـ MEP ودعم التسليم",
      "ضبط الجودة والسلامة والبرنامج الزمني",
    ],
  },
  {
    id: "service-panel-02",
    number: "02",
    titleEn: "Construction Cost Consultancy",
    titleAr: "استشارات التكاليف الإنشائية",
    descriptionEn:
      "Commercial guidance that helps clients understand budgets early, compare options, and keep construction costs under control.",
    descriptionAr: "إرشاد تجاري يساعد العملاء على فهم الميزانيات مبكراً ومقارنة الخيارات وضبط التكاليف الإنشائية.",
    offersEn: [
      "Preliminary cost planning and benchmarking",
      "Bill of quantities and tender reviews",
      "Value engineering recommendations",
      "Budget tracking across project stages",
    ],
    offersAr: [
      "التخطيط المبدئي للتكاليف والمقارنة المرجعية",
      "مراجعة جداول الكميات والعطاءات",
      "توصيات هندسة القيمة",
      "متابعة الميزانية عبر مراحل المشروع",
    ],
  },
  {
    id: "service-panel-03",
    number: "03",
    titleEn: "Project Management",
    titleAr: "إدارة المشاريع",
    descriptionEn:
      "Structured project leadership from kickoff to closeout with clear reporting, risk control, and stakeholder coordination.",
    descriptionAr: "قيادة منظمة للمشروع من البداية حتى الإغلاق مع تقارير واضحة وضبط للمخاطر وتنسيق بين جميع الأطراف.",
    offersEn: [
      "Program planning and milestone control",
      "Consultant and contractor coordination",
      "Progress reporting and issue escalation",
      "Risk, quality, and procurement oversight",
    ],
    offersAr: [
      "تخطيط البرنامج وضبط المراحل الرئيسية",
      "التنسيق بين الاستشاريين والمقاولين",
      "تقارير التقدم وتصعيد المشكلات",
      "الإشراف على المخاطر والجودة والمشتريات",
    ],
  },
  {
    id: "service-panel-04",
    number: "04",
    titleEn: "Real Estate",
    titleAr: "العقارات",
    descriptionEn:
      "Real estate support for clients seeking property opportunities, development positioning, and transaction guidance in Kuwait.",
    descriptionAr: "دعم عقاري للعملاء الباحثين عن فرص مناسبة وتوجيهات مرتبطة بالتطوير وإدارة الصفقات في الكويت.",
    offersEn: [
      "Property sourcing and opportunity review",
      "Market-oriented asset evaluation",
      "Buyer and seller coordination",
      "Development feasibility input",
    ],
    offersAr: [
      "البحث عن العقارات ومراجعة الفرص",
      "تقييم الأصول وفقاً للسوق",
      "التنسيق بين البائعين والمشترين",
      "مدخلات الجدوى التطويرية",
    ],
  },
  {
    id: "service-panel-05",
    number: "05",
    titleEn: "Property Development & Investment",
    titleAr: "التطوير العقاري والاستثمار",
    descriptionEn:
      "Development planning and investment support focused on long-term value, workable phasing, and commercially viable delivery models.",
    descriptionAr: "تخطيط تطويري ودعم استثماري يركز على القيمة طويلة الأمد ومراحل تنفيذ عملية ونماذج تسليم مجدية تجارياً.",
    offersEn: [
      "Site potential and concept review",
      "Investment and development planning",
      "Phasing and delivery strategy",
      "Commercial positioning for projects",
    ],
    offersAr: [
      "مراجعة إمكانات الموقع والمفهوم",
      "التخطيط الاستثماري والتطويري",
      "استراتيجية المراحل والتسليم",
      "التموضع التجاري للمشاريع",
    ],
  },
  {
    id: "service-panel-06",
    number: "06",
    titleEn: "Civil Engineering Works",
    titleAr: "الأعمال الهندسية المدنية",
    descriptionEn:
      "Execution of civil works packages for infrastructure, utilities, and external works with disciplined site controls.",
    descriptionAr: "تنفيذ حزم الأعمال المدنية للبنية التحتية والمرافق والأعمال الخارجية مع ضبط موقعي منظم.",
    offersEn: [
      "Roads, pavements, and grading",
      "Drainage and utility networks",
      "Earthworks and enabling works",
      "Public realm and infrastructure support",
    ],
    offersAr: [
      "الطرق والأرصفة وأعمال التسوية",
      "شبكات الصرف والخدمات",
      "الأعمال الترابية والتمهيدية",
      "دعم البنية التحتية والأعمال العامة",
    ],
  },
  {
    id: "service-panel-07",
    number: "07",
    titleEn: "Facility Management",
    titleAr: "إدارة المرافق",
    descriptionEn:
      "Operational support services that help facilities remain safe, functional, and efficient after project completion.",
    descriptionAr: "خدمات تشغيلية تساعد المرافق على البقاء آمنة وفعالة وكفؤة بعد اكتمال المشروع.",
    offersEn: [
      "Preventive and corrective maintenance",
      "MEP systems monitoring and upkeep",
      "Asset condition and service coordination",
      "Operational readiness support",
    ],
    offersAr: [
      "الصيانة الوقائية والتصحيحية",
      "مراقبة وصيانة أنظمة MEP",
      "متابعة حالة الأصول وتنسيق الخدمات",
      "دعم الجاهزية التشغيلية",
    ],
  },
  {
    id: "service-panel-08",
    number: "08",
    titleEn: "Land Sales",
    titleAr: "بيع الأراضي",
    descriptionEn:
      "Professional assistance for land transactions with practical evaluation of location, use potential, and development readiness.",
    descriptionAr: "مساندة احترافية لصفقات الأراضي مع تقييم عملي للموقع وإمكانات الاستخدام وجاهزية التطوير.",
    offersEn: [
      "Land parcel review and matching",
      "Use-case and development suitability checks",
      "Transaction coordination support",
      "Owner and buyer communication",
    ],
    offersAr: [
      "مراجعة الأراضي ومواءمتها مع المتطلبات",
      "فحص ملاءمة الاستخدام والتطوير",
      "دعم تنسيق المعاملات",
      "التواصل بين المالك والمشتري",
    ],
  },
  {
    id: "service-panel-09",
    number: "09",
    titleEn: "Architectural Drawings",
    titleAr: "المخططات المعمارية",
    descriptionEn:
      "Architectural drawing services that translate project requirements into clear layouts, presentation sets, and coordinated documents.",
    descriptionAr: "خدمات مخططات معمارية تحول متطلبات المشروع إلى توزيعات واضحة ومخططات عرض ووثائق منسقة.",
    offersEn: [
      "Concept and schematic layouts",
      "Permit and presentation drawing sets",
      "Detailed architectural drafting",
      "Coordination with engineering disciplines",
    ],
    offersAr: [
      "المفاهيم الأولية والمخططات المبدئية",
      "مخططات التراخيص والعروض التقديمية",
      "الرسم المعماري التفصيلي",
      "التنسيق مع التخصصات الهندسية",
    ],
  },
]
