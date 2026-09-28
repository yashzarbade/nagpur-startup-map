export interface CompanyData {
  id: number;
  cityId?: number;
  name: string;
  slug: string;
  websiteUrl: string;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  descriptionShort: string;
  descriptionLong: string;
  sector: string;
  companyType?: "Startup" | "Product Company" | "IT Services" | "IT/ITES" | "Tech Company / Enterprise";
  stage: "BOOTSTRAPPED" | "SEED" | "SERIES_A" | "GROWTH" | "PUBLIC";
  foundedYear: number;
  teamSize: string;
  locationName: string;
  address?: string | null;
  latitude: string;
  longitude: string;
  hiring: boolean;
  featured: boolean;
  careersUrl?: string | null;
  verificationStatus: "VERIFIED" | "PENDING" | "REJECTED";
  lastVerifiedAt: string;
  verificationSource: string;
  logoUrl?: string | null;
  tags: string[];
}

export interface FounderData {
  id: number;
  cityId?: number;
  name: string;
  slug: string;
  role: string;
  companySlug: string;
  companyName: string;
  bio: string;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  photoUrl?: string | null;
  location: string;
}

export interface JobData {
  id: number;
  cityId?: number;
  title: string;
  slug: string;
  companySlug: string;
  companyName: string;
  companyLogo?: string | null;
  description: string;
  location: string;
  remoteType: "ON_SITE" | "REMOTE" | "HYBRID";
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "FREELANCE";
  experienceMin?: number | null;
  experienceMax?: number | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  currency: string;
  skills: string;
  applicationUrl: string;
  department: string;
  postedAt: string;
  expiresAt?: string | null;
  featured: boolean;
}

export interface EventData {
  id: number;
  cityId?: number;
  title: string;
  slug: string;
  description: string;
  eventType: "MEETUP" | "HACKATHON" | "CONFERENCE" | "WORKSHOP" | "DEMO_DAY" | "NETWORKING" | "STARTUP_PITCH" | "COLLEGE_EVENT" | "OTHER";
  organizer: string;
  date: string;
  startTime: string;
  endTime?: string | null;
  venue: string;
  location: string;
  registrationUrl?: string | null;
  price: string;
  imageUrl?: string | null;
  status?: string;
  featured: boolean;
}

export interface TalentData {
  id: number;
  name: string;
  slug: string;
  title: string;
  bio: string;
  location: string;
  primarySkills: string[];
  experienceYears: number;
  openToWork: boolean;
  workPreference: "REMOTE" | "HYBRID" | "ON_SITE";
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
  avatarUrl?: string | null;
}

export const COMPANIES_DATA: CompanyData[] = [
  {
    "id": 1,
    "name": "Tata Consultancy Services (TCS)",
    "slug": "tcs-nagpur",
    "websiteUrl": "https://www.tcs.com",
    "linkedinUrl": "https://www.linkedin.com/company/tata-consultancy-services",
    "descriptionShort": "Global IT services, consulting, and digital solutions leader with a premier campus in MIHAN SEZ.",
    "descriptionLong": "Tata Consultancy Services (TCS) is a global leader in IT services, digital transformation, and business consulting. TCS operates an expansive modern campus within Nagpur's MIHAN SEZ, providing software engineering, cloud architecture, cybersecurity, and digital solutions to Fortune 500 enterprises worldwide.",
    "sector": "IT Services",
    "companyType": "Tech Company / Enterprise",
    "stage": "PUBLIC",
    "foundedYear": 1968,
    "teamSize": "1000+",
    "locationName": "MIHAN",
    "address": "TCS Nagpur Campus, MIHAN SEZ, Nagpur, Maharashtra 441108",
    "latitude": "21.0920",
    "longitude": "79.0580",
    "hiring": true,
    "featured": true,
    "careersUrl": "https://www.tcs.com/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://www.tcs.com",
    "logoUrl": "https://www.google.com/s2/favicons?domain=tcs.com&sz=128",
    "tags": [
      "IT Services",
      "Enterprise",
      "Consulting",
      "Cloud",
      "Digital Transformation"
    ]
  },
  {
    "id": 2,
    "name": "Infosys",
    "slug": "infosys-nagpur",
    "websiteUrl": "https://www.infosys.com",
    "linkedinUrl": "https://www.linkedin.com/company/infosys",
    "descriptionShort": "Global next-generation digital services and consulting multinational at MIHAN SEZ Nagpur.",
    "descriptionLong": "Infosys Limited is a global leader in next-generation digital services and consulting. The company's Nagpur development center in MIHAN SEZ specializes in cloud computing, enterprise application modernizations, and digital engineering for international clients across banking, retail, and manufacturing.",
    "sector": "IT Services",
    "companyType": "Tech Company / Enterprise",
    "stage": "PUBLIC",
    "foundedYear": 1981,
    "teamSize": "1000+",
    "locationName": "MIHAN",
    "address": "Infosys Development Centre, MIHAN SEZ, Nagpur, Maharashtra 441108",
    "latitude": "21.0910",
    "longitude": "79.0600",
    "hiring": true,
    "featured": true,
    "careersUrl": "https://www.infosys.com/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://www.infosys.com",
    "logoUrl": "https://www.google.com/s2/favicons?domain=infosys.com&sz=128",
    "tags": [
      "IT Services",
      "Enterprise",
      "Cloud",
      "Digital Transformation",
      "Consulting"
    ]
  },
  {
    "id": 3,
    "name": "HCLTech",
    "slug": "hcltech-nagpur",
    "websiteUrl": "https://www.hcltech.com",
    "linkedinUrl": "https://www.linkedin.com/company/hcltech",
    "descriptionShort": "Global technology company delivering industry-leading engineering, R&D, and digital services from MIHAN.",
    "descriptionLong": "HCLTech is a global technology company home to over 220,000 people across 60 countries. HCLTech's state-of-the-art campus in MIHAN SEZ Nagpur focuses on advanced engineering, digital process operations, and enterprise AI automation services.",
    "sector": "IT Services",
    "companyType": "Tech Company / Enterprise",
    "stage": "PUBLIC",
    "foundedYear": 1976,
    "teamSize": "1000+",
    "locationName": "MIHAN",
    "address": "HCL Technologies Ltd, MIHAN SEZ, Nagpur, Maharashtra 441108",
    "latitude": "21.0900",
    "longitude": "79.0560",
    "hiring": true,
    "featured": true,
    "careersUrl": "https://www.hcltech.com/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://www.hcltech.com",
    "logoUrl": "https://www.google.com/s2/favicons?domain=hcltech.com&sz=128",
    "tags": [
      "IT Services",
      "Enterprise",
      "Cloud",
      "AI",
      "Engineering R&D"
    ]
  },
  {
    "id": 4,
    "name": "Tech Mahindra",
    "slug": "tech-mahindra-nagpur",
    "websiteUrl": "https://www.techmahindra.com",
    "linkedinUrl": "https://www.linkedin.com/company/tech-mahindra",
    "descriptionShort": "Digital transformation, 5G engineering, consulting and business re-engineering powerhouse in MIHAN.",
    "descriptionLong": "Tech Mahindra represents the connected world, offering innovative and customer-centric information technology experiences. Operating an expansive modern campus in MIHAN SEZ, Nagpur, the team delivers telecommunications tech, enterprise cloud solutions, and digital engineering.",
    "sector": "IT Services",
    "companyType": "Tech Company / Enterprise",
    "stage": "PUBLIC",
    "foundedYear": 1986,
    "teamSize": "1000+",
    "locationName": "MIHAN",
    "address": "Tech Mahindra Campus, MIHAN SEZ, Nagpur, Maharashtra 441108",
    "latitude": "21.0930",
    "longitude": "79.0570",
    "hiring": true,
    "featured": false,
    "careersUrl": "https://www.techmahindra.com/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://www.techmahindra.com",
    "logoUrl": "https://www.google.com/s2/favicons?domain=techmahindra.com&sz=128",
    "tags": [
      "IT Services",
      "Enterprise",
      "Telecommunications",
      "Cloud",
      "Consulting"
    ]
  },
  {
    "id": 5,
    "name": "GlobalLogic (Hitachi Group)",
    "slug": "globallogic-nagpur",
    "websiteUrl": "https://www.globallogic.com",
    "linkedinUrl": "https://www.linkedin.com/company/globallogic",
    "descriptionShort": "Digital product engineering leader designing intelligent software products from MIHAN SEZ.",
    "descriptionLong": "GlobalLogic, a Hitachi Group Company, is a leader in digital product engineering. Their delivery center in MIHAN SEZ Nagpur partners with global brands to design and build innovative software products, intelligent platforms, and digital customer experiences.",
    "sector": "IT Services",
    "companyType": "Tech Company / Enterprise",
    "stage": "GROWTH",
    "foundedYear": 2000,
    "teamSize": "501-1000",
    "locationName": "MIHAN",
    "address": "GlobalLogic Hitachi, MIHAN SEZ, Nagpur, Maharashtra 441108",
    "latitude": "21.0895",
    "longitude": "79.0585",
    "hiring": true,
    "featured": false,
    "careersUrl": "https://www.globallogic.com/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://www.globallogic.com",
    "logoUrl": "https://www.google.com/s2/favicons?domain=globallogic.com&sz=128",
    "tags": [
      "IT Services",
      "Product Engineering",
      "UX",
      "Cloud",
      "Embedded Systems"
    ]
  },
  {
    "id": 6,
    "name": "Hexaware Technologies",
    "slug": "hexaware-technologies-nagpur",
    "websiteUrl": "https://www.hexaware.com",
    "linkedinUrl": "https://www.linkedin.com/company/hexaware-technologies",
    "descriptionShort": "Automation-led IT consulting and digital transformation provider with MIHAN SEZ campus.",
    "descriptionLong": "Hexaware Technologies is a fast-growing global provider of IT, BPS and consulting services. Their Nagpur facility in MIHAN SEZ delivers automation-led cloud modernization, quality engineering, generative AI implementations, and customer experience transformations.",
    "sector": "IT Services",
    "companyType": "Tech Company / Enterprise",
    "stage": "GROWTH",
    "foundedYear": 1990,
    "teamSize": "201-500",
    "locationName": "MIHAN",
    "address": "Hexaware Technologies Delivery Centre, MIHAN SEZ, Nagpur, Maharashtra 441108",
    "latitude": "21.0915",
    "longitude": "79.0590",
    "hiring": true,
    "featured": false,
    "careersUrl": "https://www.hexaware.com/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://www.hexaware.com",
    "logoUrl": "https://www.google.com/s2/favicons?domain=hexaware.com&sz=128",
    "tags": [
      "IT Services",
      "Automation",
      "Cloud Modernization",
      "AI",
      "Testing"
    ]
  },
  {
    "id": 7,
    "name": "Persistent Systems",
    "slug": "persistent-systems",
    "websiteUrl": "https://www.persistent.com",
    "linkedinUrl": "https://www.linkedin.com/company/persistent-systems",
    "descriptionShort": "Global digital engineering and enterprise modernization pioneer at Nagpur IT Park.",
    "descriptionLong": "Persistent Systems is a trusted global solutions company providing digital business acceleration, enterprise modernization, and next-generation product engineering. With a cornerstone development campus in Nagpur IT Park, Persistent plays a historic leadership role in Central India's software ecosystem.",
    "sector": "IT Services",
    "companyType": "Tech Company / Enterprise",
    "stage": "PUBLIC",
    "foundedYear": 1990,
    "teamSize": "501-1000",
    "locationName": "IT Park",
    "address": "Persistent Systems Ltd, IT Park, Gayatri Nagar, Nagpur, Maharashtra 440022",
    "latitude": "21.1320",
    "longitude": "79.0490",
    "hiring": true,
    "featured": true,
    "careersUrl": "https://www.persistent.com/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://www.persistent.com",
    "logoUrl": "https://www.google.com/s2/favicons?domain=persistent.com&sz=128",
    "tags": [
      "Software Engineering",
      "Cloud",
      "Enterprise Modernization",
      "Healthtech",
      "Fintech"
    ]
  },
  {
    "id": 8,
    "name": "Corpay Technologies India",
    "slug": "corpay-technologies",
    "websiteUrl": "https://www.corpay.com",
    "linkedinUrl": "https://www.linkedin.com/company/corpay",
    "descriptionShort": "Global corporate payments and financial technology powerhouse with a GCC in Ramdaspeth.",
    "descriptionLong": "Corpay (NYSE: CPAY) is an S&P 500 corporate payments company that helps businesses and consumers pay expenses in a simple, controlled manner. Their Global Capability Centre in Ramdaspeth, Nagpur engineers critical payment technologies, spend management platforms, and fintech infrastructure.",
    "sector": "Fintech",
    "companyType": "Tech Company / Enterprise",
    "stage": "PUBLIC",
    "foundedYear": 2000,
    "teamSize": "501-1000",
    "locationName": "Ramdaspeth",
    "address": "4th Floor, Landmark Building, Plot 5 & 6, Wardha Road, Ramdaspeth, Nagpur, Maharashtra 440012",
    "latitude": "21.1375",
    "longitude": "79.0770",
    "hiring": true,
    "featured": true,
    "careersUrl": "https://www.corpay.com/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://www.corpay.com",
    "logoUrl": "https://www.google.com/s2/favicons?domain=corpay.com&sz=128",
    "tags": [
      "Fintech",
      "Payments",
      "Enterprise",
      "GCC",
      "SaaS"
    ]
  },
  {
    "id": 9,
    "name": "Perficient India (formerly Zeon Solutions)",
    "slug": "perficient-nagpur",
    "websiteUrl": "https://www.perficient.com",
    "linkedinUrl": "https://www.linkedin.com/company/perficient",
    "descriptionShort": "Global digital consultancy and e-commerce engineering leader operating from VIPL IT Park.",
    "descriptionLong": "Perficient is a global digital consulting firm that helps the world’s leading enterprises transform their businesses through digital experience, cloud solutions, and commerce architectures. Following its acquisition of Zeon Solutions, Perficient maintains a major software delivery center on the 10th Floor of VIPL IT Park.",
    "sector": "IT Services",
    "companyType": "Tech Company / Enterprise",
    "stage": "PUBLIC",
    "foundedYear": 1997,
    "teamSize": "501-1000",
    "locationName": "IT Park",
    "address": "10th Floor, VIPL IT Park, Gayatri Nagar, Nagpur, Maharashtra 440022",
    "latitude": "21.1256",
    "longitude": "79.0496",
    "hiring": true,
    "featured": false,
    "careersUrl": "https://www.perficient.com/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://www.perficient.com",
    "logoUrl": "https://www.google.com/s2/favicons?domain=perficient.com&sz=128",
    "tags": [
      "IT Services",
      "Ecommerce",
      "Digital Consulting",
      "Cloud",
      "Enterprise"
    ]
  },
  {
    "id": 10,
    "name": "Ceinsys Tech Ltd (formerly ADCC Infocom)",
    "slug": "ceinsys-tech",
    "websiteUrl": "https://www.cstech.ai",
    "linkedinUrl": "https://www.linkedin.com/company/ceinsys-tech-ltd",
    "descriptionShort": "BSE-listed geospatial AI engineering, smart cities, and mobility engineering firm at IT Park.",
    "descriptionLong": "Ceinsys Tech Ltd (BSE: 538734) is a technology company specializing in geospatial intelligence, digital engineering, mobility systems, and AI-powered smart infrastructure solutions. Headquartered at Nagpur IT Park opposite VNIT, Ceinsys delivers complex spatial and software engineering across India and internationally.",
    "sector": "Deeptech",
    "companyType": "Tech Company / Enterprise",
    "stage": "PUBLIC",
    "foundedYear": 1998,
    "teamSize": "1000+",
    "locationName": "IT Park",
    "address": "10/5, IT Park, Opposite VNIT, Gayatri Nagar, Nagpur, Maharashtra 440022",
    "latitude": "21.1250",
    "longitude": "79.0495",
    "hiring": true,
    "featured": true,
    "careersUrl": "https://www.cstech.ai/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://www.cstech.ai",
    "logoUrl": "https://www.google.com/s2/favicons?domain=cstech.ai&sz=128",
    "tags": [
      "Geospatial",
      "AI",
      "Smart Cities",
      "Enterprise",
      "Engineering"
    ]
  },
  {
    "id": 11,
    "name": "InfoCepts",
    "slug": "infocepts",
    "websiteUrl": "https://www.infocepts.com",
    "linkedinUrl": "https://www.linkedin.com/company/infocepts",
    "descriptionShort": "Flagship Nagpur homegrown data analytics, business intelligence and AI consulting firm.",
    "descriptionLong": "InfoCepts is Nagpur's landmark homegrown technology success story, founded in 2004 by VNIT alumnus Shashank Dixit. Specializing in enterprise data engineering, cloud data modernization, and AI-driven business intelligence, InfoCepts enables global leaders like Nielsen and NBCUniversal to make data-driven decisions.",
    "sector": "AI",
    "companyType": "Product Company",
    "stage": "GROWTH",
    "foundedYear": 2004,
    "teamSize": "501-1000",
    "locationName": "Dharampeth",
    "address": "InfoCepts, West High Court Road, Dharampeth, Nagpur, Maharashtra 440010",
    "latitude": "21.1450",
    "longitude": "79.0780",
    "hiring": true,
    "featured": true,
    "careersUrl": "https://www.infocepts.com/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://www.infocepts.com",
    "logoUrl": "https://www.google.com/s2/favicons?domain=infocepts.com&sz=128",
    "tags": [
      "Data Analytics",
      "AI",
      "Business Intelligence",
      "Cloud Data",
      "Data Engineering"
    ]
  },
  {
    "id": 12,
    "name": "Trust Fintech Limited",
    "slug": "trust-fintech",
    "websiteUrl": "https://www.softtrust.com",
    "linkedinUrl": "https://www.linkedin.com/company/trust-fintech-limited",
    "descriptionShort": "NSE-listed banking software product company providing TrustBankCBS and fintech platforms.",
    "descriptionLong": "Trust Fintech Limited (NSE: TRUST) is a publicly listed software company founded in Nagpur in 1998. It specializes in core banking software (TrustBankCBS), loan origination systems, compliance/AML, and AI-enabled digital banking solutions implemented across hundreds of commercial, regional, and cooperative banks.",
    "sector": "Fintech",
    "companyType": "Product Company",
    "stage": "PUBLIC",
    "foundedYear": 1998,
    "teamSize": "201-500",
    "locationName": "IT Park",
    "address": "11/4, Infotech Park, Gayatri Nagar, Parsodi, Nagpur, Maharashtra 440022",
    "latitude": "21.1258",
    "longitude": "79.0492",
    "hiring": true,
    "featured": true,
    "careersUrl": "https://www.softtrust.com/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://www.softtrust.com",
    "logoUrl": "https://www.google.com/s2/favicons?domain=softtrust.com&sz=128",
    "tags": [
      "Fintech",
      "Core Banking",
      "SaaS",
      "Public",
      "Software"
    ]
  },
  {
    "id": 13,
    "name": "Virtual Galaxy Infotech (VGIL)",
    "slug": "virtual-galaxy-infotech",
    "websiteUrl": "https://vgipl.com",
    "linkedinUrl": "https://www.linkedin.com/company/virtual-galaxy-infotech-ltd",
    "descriptionShort": "Homegrown core banking and ERP software company powering banks across India and Africa.",
    "descriptionLong": "Virtual Galaxy Infotech Limited (VGIL) is an established software product engineering company founded in 1997 in Nagpur. VGIL created the E-Banker Core Banking Suite, currently deployed across more than 150 cooperative and commercial banks in India and internationally.",
    "sector": "Fintech",
    "companyType": "Product Company",
    "stage": "GROWTH",
    "foundedYear": 1997,
    "teamSize": "201-500",
    "locationName": "Vivekanand Nagar",
    "address": "Plot No. 26, Vivekanand Nagar, Wardha Road, Nagpur, Maharashtra 440015",
    "latitude": "21.1215",
    "longitude": "79.0760",
    "hiring": true,
    "featured": false,
    "careersUrl": "https://vgipl.com/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://vgipl.com",
    "logoUrl": "https://www.google.com/s2/favicons?domain=vgipl.com&sz=128",
    "tags": [
      "Fintech",
      "Core Banking",
      "ERP",
      "Enterprise",
      "Financial Software"
    ]
  },
  {
    "id": 14,
    "name": "MasterSoft ERP Solutions",
    "slug": "mastersoft-erp-solutions",
    "websiteUrl": "https://www.mastersofterp.in",
    "linkedinUrl": "https://www.linkedin.com/company/mastersofterp",
    "descriptionShort": "India's largest educational ERP provider powering 2,000+ colleges and universities.",
    "descriptionLong": "MasterSoft ERP Solutions is India's leading education technology provider, based in Nagpur. Founded in 1995 by Sham Somani, MasterSoft digitizes academic and administrative processes for premier higher education institutions, deemed universities, and school networks nationwide.",
    "sector": "Edtech",
    "companyType": "Product Company",
    "stage": "GROWTH",
    "foundedYear": 1995,
    "teamSize": "201-500",
    "locationName": "New Nandanvan",
    "address": "1456, New Nandanvan, Nagpur, Maharashtra 440009",
    "latitude": "21.1310",
    "longitude": "79.1300",
    "hiring": true,
    "featured": true,
    "careersUrl": "https://www.mastersofterp.in/career/",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://www.mastersofterp.in",
    "logoUrl": "https://www.google.com/s2/favicons?domain=mastersofterp.in&sz=128",
    "tags": [
      "Edtech",
      "ERP",
      "SaaS",
      "Higher Education",
      "Accreditation"
    ]
  },
  {
    "id": 15,
    "name": "Micropro Software Solutions Limited",
    "slug": "micropro-software-solutions",
    "websiteUrl": "https://www.microproindia.com",
    "linkedinUrl": "https://www.linkedin.com/company/microproindia",
    "descriptionShort": "Publicly listed IT enterprise specializing in healthcare software HospyCare and e-governance.",
    "descriptionLong": "Micropro Software Solutions Limited (NSE Emerge: MICROPRO) was incorporated in 1996 in Nagpur. It specializes in software development, data digitization, and hospital information systems, notably its proprietary HospyCare suite adopted by major government and multi-specialty healthcare networks.",
    "sector": "Software",
    "companyType": "Product Company",
    "stage": "PUBLIC",
    "foundedYear": 1996,
    "teamSize": "51-200",
    "locationName": "IT Park",
    "address": "Plot No. 28, 702 A-Wing, IT Park, Gayatri Nagar, Nagpur, Maharashtra 440022",
    "latitude": "21.1255",
    "longitude": "79.0498",
    "hiring": false,
    "featured": false,
    "careersUrl": "https://www.microproindia.com/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://www.microproindia.com",
    "logoUrl": "https://www.google.com/s2/favicons?domain=microproindia.com&sz=128",
    "tags": [
      "Healthcare",
      "Software",
      "HospyCare",
      "Public",
      "Hospital ERP"
    ]
  },
  {
    "id": 16,
    "name": "Excellon Software",
    "slug": "excellon-software",
    "websiteUrl": "https://www.excellonsoft.com",
    "linkedinUrl": "https://www.linkedin.com/company/excellon-software-pvt.-ltd.",
    "descriptionShort": "Leading automotive and distribution ERP SaaS company located in Infotech Tower, IT Park.",
    "descriptionLong": "Excellon Software is a recognized product leader in Dealer Management Systems (DMS) and Distribution Management Software. Headquartered in Nagpur IT Park with deployments across India and Southeast Asia, Excellon provides cloud SaaS to automotive OEMs and large retail networks.",
    "sector": "SaaS",
    "companyType": "Product Company",
    "stage": "GROWTH",
    "foundedYear": 2000,
    "teamSize": "201-500",
    "locationName": "IT Park",
    "address": "301, Infotech Tower, IT Park, Gayatri Nagar, Nagpur, Maharashtra 440022",
    "latitude": "21.1252",
    "longitude": "79.0491",
    "hiring": true,
    "featured": true,
    "careersUrl": "https://www.excellonsoft.com/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://www.excellonsoft.com",
    "logoUrl": "https://www.google.com/s2/favicons?domain=excellonsoft.com&sz=128",
    "tags": [
      "SaaS",
      "DMS",
      "Automotive",
      "Supply Chain",
      "B2B"
    ]
  },
  {
    "id": 17,
    "name": "Lighthouse Info Systems",
    "slug": "lighthouse-info-systems",
    "websiteUrl": "https://www.lighthouseerp.com",
    "linkedinUrl": "https://www.linkedin.com/company/lighthouse-info-systems",
    "descriptionShort": "Pioneering Nagpur industrial ERP software company serving steel, manufacturing, and trade.",
    "descriptionLong": "Lighthouse Info Systems has been developing end-to-end industrial Enterprise Resource Planning (ERP) solutions from Nagpur for more than 35 years. Lighthouse ERP powers heavy manufacturing, steel mills, mining, and supply chain enterprises across India.",
    "sector": "Software",
    "companyType": "Product Company",
    "stage": "GROWTH",
    "foundedYear": 1987,
    "teamSize": "51-200",
    "locationName": "IT Park",
    "address": "IT Park, Gayatri Nagar, Parsodi, Nagpur, Maharashtra 440022",
    "latitude": "21.1265",
    "longitude": "79.0505",
    "hiring": false,
    "featured": false,
    "careersUrl": "https://www.lighthouseerp.com/career",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://www.lighthouseerp.com",
    "logoUrl": "https://www.google.com/s2/favicons?domain=lighthouseerp.com&sz=128",
    "tags": [
      "ERP",
      "Manufacturing",
      "Industrial Software",
      "Steel",
      "B2B"
    ]
  },
  {
    "id": 18,
    "name": "Kratin LLC (Kratin Software Solutions)",
    "slug": "kratin-software-solutions",
    "websiteUrl": "https://kratin.co.in",
    "linkedinUrl": "https://www.linkedin.com/company/kratin-software-solutions",
    "descriptionShort": "Digital healthcare product firm pioneering TruliaCare and Unified Health Experiences from Besa.",
    "descriptionLong": "Kratin is an innovative healthcare technology product group founded in 2007. Kratin built TruliaCare, an AI-augmented care coordination and chronic condition management platform utilized by healthcare systems, hospices, and digital care teams across North America and India.",
    "sector": "Healthtech",
    "companyType": "Product Company",
    "stage": "GROWTH",
    "foundedYear": 2007,
    "teamSize": "51-200",
    "locationName": "Besa",
    "address": "Kratin Software Solutions, Besa, Nagpur, Maharashtra 440037",
    "latitude": "21.0850",
    "longitude": "79.0820",
    "hiring": true,
    "featured": false,
    "careersUrl": "https://kratin.co.in/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://kratin.co.in",
    "logoUrl": "https://www.google.com/s2/favicons?domain=kratin.co.in&sz=128",
    "tags": [
      "Healthtech",
      "TruliaCare",
      "Telehealth",
      "AI in Healthcare",
      "Product"
    ]
  },
  {
    "id": 19,
    "name": "BusinessEzee",
    "slug": "businessezee",
    "websiteUrl": "https://businessezee.com",
    "linkedinUrl": "https://www.linkedin.com/company/businessezee",
    "descriptionShort": "All-in-one cloud ERP, CRM, and marketing automation suite for modern growing enterprises.",
    "descriptionLong": "BusinessEzee is an integrated business management platform developed in Nagpur. It connects customer relationship management (CRM), multi-channel marketing automation, sales pipeline tracking, and payroll into a seamless cloud ecosystem for SMEs and scaling businesses.",
    "sector": "SaaS",
    "companyType": "Product Company",
    "stage": "BOOTSTRAPPED",
    "foundedYear": 2019,
    "teamSize": "11-50",
    "locationName": "IT Park",
    "address": "IT Park Road, Subhash Nagar, Nagpur, Maharashtra 440022",
    "latitude": "21.1290",
    "longitude": "79.0550",
    "hiring": false,
    "featured": false,
    "careersUrl": "https://businessezee.com/career",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://businessezee.com",
    "logoUrl": "https://www.google.com/s2/favicons?domain=businessezee.com&sz=128",
    "tags": [
      "SaaS",
      "CRM",
      "ERP",
      "Marketing Automation",
      "B2B"
    ]
  },
  {
    "id": 20,
    "name": "Kizora Software",
    "slug": "kizora-software",
    "websiteUrl": "http://www.kizora.com",
    "linkedinUrl": "https://www.linkedin.com/company/kizora-software",
    "descriptionShort": "Enterprise cloud software development company delivering custom web and SaaS architectures.",
    "descriptionLong": "Kizora Software Private Limited is an IT services and custom software development company based near Nagpur IT Park. They design tailored SaaS solutions, enterprise database architectures, and responsive web portals for mid-market clients.",
    "sector": "SaaS",
    "companyType": "Product Company",
    "stage": "BOOTSTRAPPED",
    "foundedYear": 2012,
    "teamSize": "11-50",
    "locationName": "IT Park",
    "address": "Near IT Park, Subhash Nagar, Nagpur, Maharashtra 440022",
    "latitude": "21.1260",
    "longitude": "79.0520",
    "hiring": false,
    "featured": false,
    "careersUrl": "http://www.kizora.com/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "http://www.kizora.com",
    "logoUrl": "https://www.google.com/s2/favicons?domain=kizora.com&sz=128",
    "tags": [
      "SaaS",
      "Cloud",
      "Custom Software",
      "Web Applications"
    ]
  },
  {
    "id": 21,
    "name": "YourPhysio (Fix Health)",
    "slug": "yourphysio",
    "websiteUrl": "https://yourphysio.in",
    "linkedinUrl": "https://www.linkedin.com/company/yourphysio",
    "descriptionShort": "Nagpur healthtech startup providing digital physiotherapy backed by Titan Capital & Better Capital.",
    "descriptionLong": "YourPhysio (rebranded as Fix Health) is a prominent healthcare technology startup founded in Nagpur by Ashutosh Mundhada and Dr. Sheetal Mundhada. Backed by top venture funds, the platform delivers tele-rehabilitation, posture tracking, and personalized physiotherapy regimens to patients across India.",
    "sector": "Healthtech",
    "companyType": "Startup",
    "stage": "SEED",
    "foundedYear": 2020,
    "teamSize": "51-200",
    "locationName": "Ramdaspeth",
    "address": "Ramdaspeth, Wardha Road, Nagpur, Maharashtra 440010",
    "latitude": "21.1350",
    "longitude": "79.0720",
    "hiring": true,
    "featured": true,
    "careersUrl": "https://yourphysio.in/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://yourphysio.in",
    "logoUrl": "https://www.google.com/s2/favicons?domain=yourphysio.in&sz=128",
    "tags": [
      "Healthtech",
      "Physiotherapy",
      "Digital Health",
      "Venture Backed",
      "Telehealth"
    ]
  },
  {
    "id": 22,
    "name": "ErlySign",
    "slug": "erlysign",
    "websiteUrl": "https://erlysign.com",
    "linkedinUrl": "https://www.linkedin.com/company/erlysign",
    "descriptionShort": "Oral cancer early-detection biotech startup granted US FDA Breakthrough Device Designation.",
    "descriptionLong": "ErlySign is an award-winning healthtech biotechnology startup incubated at VNIT Nagpur. ErlySign developed a proprietary, non-invasive saliva biomarker test kit that detects precancerous oral lesions in minutes, earning it the prestigious US FDA Breakthrough Device Designation.",
    "sector": "Healthtech",
    "companyType": "Startup",
    "stage": "SEED",
    "foundedYear": 2021,
    "teamSize": "11-50",
    "locationName": "Dharampeth",
    "address": "CIVN VNIT Campus, South Ambazari Road, Nagpur, Maharashtra 440010",
    "latitude": "21.1275",
    "longitude": "79.0520",
    "hiring": false,
    "featured": true,
    "careersUrl": "https://erlysign.com/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://erlysign.com",
    "logoUrl": "https://www.google.com/s2/favicons?domain=erlysign.com&sz=128",
    "tags": [
      "Healthtech",
      "Biotech",
      "Cancer Diagnostics",
      "FDA Breakthrough",
      "Deeptech"
    ]
  },
  {
    "id": 23,
    "name": "CropData Technology",
    "slug": "cropdata-technology",
    "websiteUrl": "https://cropdata.in",
    "linkedinUrl": "https://www.linkedin.com/company/cropdata-technology",
    "descriptionShort": "Nagpur-headquartered agritech pioneer building blockchain e-marketplaces and geospatial AI.",
    "descriptionLong": "CropData Technology is a flagship agritech company based in Nagpur that digitizes the agricultural value chain. Utilizing its proprietary GSTM geospatial tile mapping, AI predictive models, and blockchain e-marketplace, CropData connects smallholder farmers directly to institutional buyers and financial services.",
    "sector": "Agritech",
    "companyType": "Startup",
    "stage": "GROWTH",
    "foundedYear": 2013,
    "teamSize": "51-200",
    "locationName": "Civil Lines",
    "address": "Civil Lines, Nagpur, Maharashtra 440001",
    "latitude": "21.1520",
    "longitude": "79.0730",
    "hiring": true,
    "featured": true,
    "careersUrl": "https://cropdata.in/career",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://cropdata.in",
    "logoUrl": "https://www.google.com/s2/favicons?domain=cropdata.in&sz=128",
    "tags": [
      "Agritech",
      "Blockchain",
      "Geospatial",
      "AI",
      "AgriFintech"
    ]
  },
  {
    "id": 24,
    "name": "Melooha",
    "slug": "melooha",
    "websiteUrl": "https://www.melooha.com",
    "linkedinUrl": "https://www.linkedin.com/company/melooha",
    "descriptionShort": "AI-powered hyper-personalized astrology and lifestyle guidance platform built in Nagpur.",
    "descriptionLong": "Melooha is an innovative consumer AI platform combining ancient astrological science with state-of-the-art natural language processing and machine learning. Founded and developed in Nagpur, Melooha has attracted international users seeking personalized guidance.",
    "sector": "AI",
    "companyType": "Startup",
    "stage": "SEED",
    "foundedYear": 2022,
    "teamSize": "11-50",
    "locationName": "Civil Lines",
    "address": "Civil Lines, Nagpur, Maharashtra 440001",
    "latitude": "21.1525",
    "longitude": "79.0765",
    "hiring": false,
    "featured": false,
    "careersUrl": "https://www.melooha.com/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://www.melooha.com",
    "logoUrl": "https://www.google.com/s2/favicons?domain=melooha.com&sz=128",
    "tags": [
      "AI",
      "Consumer Tech",
      "NLP",
      "Machine Learning",
      "Mobile App"
    ]
  },
  {
    "id": 25,
    "name": "Immverse AI",
    "slug": "immverse-ai",
    "websiteUrl": "https://immverse.ai",
    "linkedinUrl": "https://www.linkedin.com/company/immverseai",
    "descriptionShort": "Generative AI and computer vision research and edtech platform headquartered in Nagpur.",
    "descriptionLong": "Immverse AI is a deeptech startup focused on multimodal generative AI models, avatars, and next-generation educational interfaces. With research labs in Nagpur, Immverse AI collaborates with universities and global enterprises to democratize AI tooling.",
    "sector": "AI",
    "companyType": "Startup",
    "stage": "SEED",
    "foundedYear": 2023,
    "teamSize": "11-50",
    "locationName": "MIHAN",
    "address": "MIHAN SEZ, Nagpur, Maharashtra 441108",
    "latitude": "21.0912",
    "longitude": "79.0568",
    "hiring": true,
    "featured": false,
    "careersUrl": "https://immverse.ai/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://immverse.ai",
    "logoUrl": "https://www.google.com/s2/favicons?domain=immverse.ai&sz=128",
    "tags": [
      "AI",
      "Generative AI",
      "Computer Vision",
      "Edtech",
      "Research"
    ]
  },
  {
    "id": 26,
    "name": "Frikly",
    "slug": "frikly",
    "websiteUrl": "https://frikly.com",
    "linkedinUrl": "https://www.linkedin.com/company/frikly",
    "descriptionShort": "Online marketplace for interior design materials, laminates, and architectural hardware.",
    "descriptionLong": "Frikly is a high-growth e-commerce marketplace founded in 2022 in Nagpur by Rajkumar Malu. The platform simplifies procurement for interior designers, architects, and homeowners by offering thousands of laminates, wall panels, louvers, and decorative hardware with doorstep delivery.",
    "sector": "Ecommerce",
    "companyType": "Startup",
    "stage": "SEED",
    "foundedYear": 2022,
    "teamSize": "11-50",
    "locationName": "Gandhibagh",
    "address": "Central Avenue, Gandhibagh, Nagpur, Maharashtra 440002",
    "latitude": "21.1510",
    "longitude": "79.1120",
    "hiring": true,
    "featured": true,
    "careersUrl": "https://frikly.com/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://frikly.com",
    "logoUrl": "https://www.google.com/s2/favicons?domain=frikly.com&sz=128",
    "tags": [
      "Ecommerce",
      "Interior Tech",
      "Marketplace",
      "D2C",
      "Construction Tech"
    ]
  },
  {
    "id": 27,
    "name": "Wings Lifestyle",
    "slug": "wings-lifestyle",
    "websiteUrl": "https://www.wingslifestyle.com",
    "linkedinUrl": "https://www.linkedin.com/company/wingslifestyle",
    "descriptionShort": "National consumer electronics and gaming audio D2C brand registered in Nagpur.",
    "descriptionLong": "Wings Lifestyle is one of India's fastest-growing consumer technology brands, specializing in gaming earbuds, gaming smartwatches, and soundbars. With registered roots in Nagpur, Wings has built a major presence across Amazon, Flipkart, and leading retail chains.",
    "sector": "D2C",
    "companyType": "Startup",
    "stage": "GROWTH",
    "foundedYear": 2018,
    "teamSize": "51-200",
    "locationName": "Itwari",
    "address": "Itwari, Nagpur, Maharashtra 440002",
    "latitude": "21.1540",
    "longitude": "79.1150",
    "hiring": false,
    "featured": false,
    "careersUrl": "https://www.wingslifestyle.com/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://www.wingslifestyle.com",
    "logoUrl": "https://www.google.com/s2/favicons?domain=wingslifestyle.com&sz=128",
    "tags": [
      "D2C",
      "Consumer Tech",
      "Gaming",
      "Audio",
      "Hardware"
    ]
  },
  {
    "id": 28,
    "name": "Coursefinder.ai",
    "slug": "coursefinder-ai",
    "websiteUrl": "https://www.coursefinder.ai",
    "linkedinUrl": "https://www.linkedin.com/company/coursefinder-ai",
    "descriptionShort": "AI-driven study-abroad discovery and application processing platform for international students.",
    "descriptionLong": "Coursefinder.ai is an intelligent edtech platform simplifying the study-abroad pathway. Using algorithmic course matching, visa guidance workflows, and university portals, Coursefinder connects aspiring Indian students with over 1,500 global institutions.",
    "sector": "Edtech",
    "companyType": "Startup",
    "stage": "SEED",
    "foundedYear": 2021,
    "teamSize": "11-50",
    "locationName": "Dharampeth",
    "address": "Dharampeth Extension, Nagpur, Maharashtra 440010",
    "latitude": "21.1448",
    "longitude": "79.0760",
    "hiring": true,
    "featured": false,
    "careersUrl": "https://www.coursefinder.ai/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://www.coursefinder.ai",
    "logoUrl": "https://www.google.com/s2/favicons?domain=coursefinder.ai&sz=128",
    "tags": [
      "Edtech",
      "AI",
      "Study Abroad",
      "Higher Education",
      "Platform"
    ]
  },
  {
    "id": 29,
    "name": "Tech Lync (Tech-Lync Learning Technologies)",
    "slug": "tech-lync",
    "websiteUrl": "https://tech-lync.com",
    "linkedinUrl": "https://www.linkedin.com/company/tech-lync",
    "descriptionShort": "Technical upskilling platform providing hands-on training in EV design, Data Science, and VLSI.",
    "descriptionLong": "Tech Lync Learning Technologies is an engineering education and career accelerator based in Nagpur. It offers project-based training programs in Electric Vehicle Design, Full Stack Development, Data Engineering, and Semiconductors to make students job-ready for modern industry roles.",
    "sector": "Edtech",
    "companyType": "Startup",
    "stage": "BOOTSTRAPPED",
    "foundedYear": 2023,
    "teamSize": "11-50",
    "locationName": "Manewada",
    "address": "1st Floor, Omkar Nagar Road, near Sahyadri Lawn, Omkar Nagar, Nagpur, Maharashtra 440027",
    "latitude": "21.0980",
    "longitude": "79.0990",
    "hiring": true,
    "featured": false,
    "careersUrl": "https://tech-lync.com/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://tech-lync.com",
    "logoUrl": "https://www.google.com/s2/favicons?domain=tech-lync.com&sz=128",
    "tags": [
      "Edtech",
      "Upskilling",
      "EV Design",
      "Data Science",
      "Training"
    ]
  },
  {
    "id": 30,
    "name": "Aerizone Creative Labs",
    "slug": "aerizone",
    "websiteUrl": "https://aerizone.com",
    "linkedinUrl": "https://www.linkedin.com/company/aerizone",
    "descriptionShort": "Enterprise drone survey, GIS mapping, and aerial visual inspection solutions provider.",
    "descriptionLong": "Aerizone Creative Labs is a deeptech drone solutions company headquartered on Hingna Road, Nagpur. The firm provides precision aerial surveying, volumetric calculation, 3D photogrammetry, and industrial asset inspection for construction, solar farms, and infrastructure projects.",
    "sector": "Deeptech",
    "companyType": "Startup",
    "stage": "BOOTSTRAPPED",
    "foundedYear": 2017,
    "teamSize": "11-50",
    "locationName": "Hingna",
    "address": "1st Floor, Kashit Enclave, Hingna Road, Ambazari, Nagpur, Maharashtra 440022",
    "latitude": "21.1185",
    "longitude": "79.0380",
    "hiring": false,
    "featured": false,
    "careersUrl": "https://aerizone.com/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://aerizone.com",
    "logoUrl": "https://www.google.com/s2/favicons?domain=aerizone.com&sz=128",
    "tags": [
      "Deeptech",
      "Drones",
      "GIS Mapping",
      "Aerial Intelligence",
      "Surveying"
    ]
  },
  {
    "id": 31,
    "name": "Aerovania",
    "slug": "aerovania",
    "websiteUrl": "https://aerovania.com",
    "linkedinUrl": "https://www.linkedin.com/company/aerovania",
    "descriptionShort": "Aerial intelligence and drone analytics startup providing LiDAR surveys for Railways and Mining.",
    "descriptionLong": "Aerovania Private Limited is an aerial intelligence and drone inspection startup based in Nagpur. Aerovania delivers high-resolution drone mapping, LiDAR corridor scanning, and computer-vision-based structural monitoring for clients including Indian Railways and Coal India.",
    "sector": "Deeptech",
    "companyType": "Startup",
    "stage": "BOOTSTRAPPED",
    "foundedYear": 2021,
    "teamSize": "11-50",
    "locationName": "Hingna",
    "address": "Police Nagar, MIDC Hingna Road, Nagpur, Maharashtra 440016",
    "latitude": "21.1110",
    "longitude": "79.0150",
    "hiring": false,
    "featured": false,
    "careersUrl": "https://aerovania.com/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://aerovania.com",
    "logoUrl": "https://www.google.com/s2/favicons?domain=aerovania.com&sz=128",
    "tags": [
      "Deeptech",
      "Drones",
      "LiDAR",
      "Infrastructure",
      "AI Analytics"
    ]
  },
  {
    "id": 32,
    "name": "Sensify Technologies",
    "slug": "sensify-technologies",
    "websiteUrl": "https://sensify.in",
    "linkedinUrl": "https://www.linkedin.com/company/sensify-technologies",
    "descriptionShort": "VNIT-incubated embedded systems, IoT sensors, and OEM industrial automation engineering firm.",
    "descriptionLong": "Sensify Technologies is an embedded systems engineering and IoT product company originally incubated at VNIT Nagpur. They design customized PCB hardware, industrial IoT sensors, telemetry units, and embedded firmware for energy and manufacturing automation.",
    "sector": "Deeptech",
    "companyType": "Startup",
    "stage": "BOOTSTRAPPED",
    "foundedYear": 2017,
    "teamSize": "11-50",
    "locationName": "Wathoda",
    "address": "Plot No. 81, Vidya Nagar, Wathoda Layout, Nagpur, Maharashtra 440009",
    "latitude": "21.1390",
    "longitude": "79.1410",
    "hiring": false,
    "featured": false,
    "careersUrl": "https://sensify.in/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://sensify.in",
    "logoUrl": "https://www.google.com/s2/favicons?domain=sensify.in&sz=128",
    "tags": [
      "Deeptech",
      "IoT",
      "Embedded Systems",
      "Hardware",
      "Automation"
    ]
  },
  {
    "id": 33,
    "name": "Lemon Ideas Innovations",
    "slug": "lemon-ideas",
    "websiteUrl": "https://www.lemonideas.in",
    "linkedinUrl": "https://www.linkedin.com/company/lemon-ideas",
    "descriptionShort": "Premier Nagpur startup incubation, venture creation, and entrepreneurship enablement ecosystem.",
    "descriptionLong": "Lemon Ideas is Nagpur's pioneer startup incubation and venture mentoring ecosystem, established in 2013 by Deepak Menaria. Through pre-incubation programs, mentoring cohorts, and seed support, Lemon Ideas has mentored over 100 early-stage ventures and student entrepreneurs in Central India.",
    "sector": "Deeptech",
    "companyType": "Startup",
    "stage": "BOOTSTRAPPED",
    "foundedYear": 2013,
    "teamSize": "11-50",
    "locationName": "Wardha Road",
    "address": "Beltarodi Road, Besa, Nagpur, Maharashtra 440037",
    "latitude": "21.0870",
    "longitude": "79.0760",
    "hiring": false,
    "featured": false,
    "careersUrl": "https://www.lemonideas.in/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://www.lemonideas.in",
    "logoUrl": "https://www.google.com/s2/favicons?domain=lemonideas.in&sz=128",
    "tags": [
      "Startup Incubator",
      "Entrepreneurship",
      "Mentorship",
      "Innovation",
      "Ecosystem"
    ]
  },
  {
    "id": 34,
    "name": "smartData Enterprises",
    "slug": "smartdata-enterprises",
    "websiteUrl": "https://www.smartdatainc.com",
    "linkedinUrl": "https://www.linkedin.com/company/smartdata-enterprises-inc",
    "descriptionShort": "Global enterprise software engineering and digital health architecture firm at Fuji Tower, MIHAN.",
    "descriptionLong": "smartData Enterprises is an established global software solutions architect. Operating from its flagship Fuji Tower campus in MIHAN SEZ, Nagpur, smartData builds enterprise web platforms, HIPAA-compliant digital health applications, and custom cloud ecosystems for global technology companies.",
    "sector": "IT Services",
    "companyType": "IT Services",
    "stage": "GROWTH",
    "foundedYear": 1999,
    "teamSize": "501-1000",
    "locationName": "MIHAN",
    "address": "Fuji Tower, 9 R, MIHAN, Nagpur, Maharashtra 441108",
    "latitude": "21.0890",
    "longitude": "79.0550",
    "hiring": true,
    "featured": false,
    "careersUrl": "https://www.smartdatainc.com/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://www.smartdatainc.com",
    "logoUrl": "https://www.google.com/s2/favicons?domain=smartdatainc.com&sz=128",
    "tags": [
      "IT Services",
      "Digital Health",
      "Cloud Software",
      "Enterprise",
      "Web Development"
    ]
  },
  {
    "id": 35,
    "name": "Novatech Software",
    "slug": "novatech-software",
    "websiteUrl": "https://www.novatechsoftware.com",
    "linkedinUrl": "https://www.linkedin.com/company/novatech-software-pvt-ltd",
    "descriptionShort": "Export-oriented custom software development and cloud engineering firm at Infotech Tower.",
    "descriptionLong": "Novatech Software Pvt. Ltd. is an export-oriented software development enterprise founded in 1999, located at Infotech Tower, IT Park, Parsodi. They specialize in bespoke enterprise web systems, database design, and cloud consulting for international corporate clients.",
    "sector": "Software",
    "companyType": "IT Services",
    "stage": "GROWTH",
    "foundedYear": 1999,
    "teamSize": "51-200",
    "locationName": "IT Park",
    "address": "Unit 103, Infotech Tower, IT Park, Parsodi, Nagpur, Maharashtra 440022",
    "latitude": "21.1252",
    "longitude": "79.0494",
    "hiring": false,
    "featured": false,
    "careersUrl": "https://www.novatechsoftware.com/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://www.novatechsoftware.com",
    "logoUrl": "https://www.google.com/s2/favicons?domain=novatechsoftware.com&sz=128",
    "tags": [
      "Software",
      "Custom Development",
      "IT Services",
      "Cloud",
      "Enterprise"
    ]
  },
  {
    "id": 36,
    "name": "KloudData Labs",
    "slug": "klouddata",
    "websiteUrl": "https://www.klouddata.com",
    "linkedinUrl": "https://www.linkedin.com/company/klouddata-inc",
    "descriptionShort": "Global enterprise software solutions firm specializing in SAP consulting and analytics at MIHAN.",
    "descriptionLong": "KloudData Labs is an enterprise software and cloud consultancy located in the Central Facility Building at MIHAN SEZ, Nagpur. KloudData provides SAP implementations, enterprise cloud migration, analytics, and custom mobile applications to Fortune 1000 organizations.",
    "sector": "SaaS",
    "companyType": "IT Services",
    "stage": "GROWTH",
    "foundedYear": 2008,
    "teamSize": "201-500",
    "locationName": "MIHAN",
    "address": "Central Facility Building, 1st Floor, A-Block, MIHAN SEZ, Nagpur, Maharashtra 441108",
    "latitude": "21.0905",
    "longitude": "79.0575",
    "hiring": true,
    "featured": false,
    "careersUrl": "https://www.klouddata.com/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://www.klouddata.com",
    "logoUrl": "https://www.google.com/s2/favicons?domain=klouddata.com&sz=128",
    "tags": [
      "SAP",
      "Cloud Migration",
      "Enterprise Analytics",
      "IT Services",
      "SaaS"
    ]
  },
  {
    "id": 37,
    "name": "KCyber Experts Pvt Ltd",
    "slug": "kcyber-experts",
    "websiteUrl": "https://www.kcyberexperts.com",
    "linkedinUrl": "https://www.linkedin.com/company/kcyberexperts",
    "descriptionShort": "Cybersecurity, VAPT, forensics, and threat mitigation firm located on GPO Road, Civil Lines.",
    "descriptionLong": "KCyber Experts Pvt Ltd is a specialized cybersecurity and digital assurance firm headquartered in Civil Lines, Nagpur, with an international office in Dubai. They deliver Vulnerability Assessment & Penetration Testing (VAPT), incident response, SOC monitoring, and ISO 27001 audit services.",
    "sector": "Cybersecurity",
    "companyType": "IT Services",
    "stage": "BOOTSTRAPPED",
    "foundedYear": 2020,
    "teamSize": "11-50",
    "locationName": "Civil Lines",
    "address": "Plot No. 246-A, GPO Road, Civil Lines, Nagpur, Maharashtra 440001",
    "latitude": "21.1512",
    "longitude": "79.0768",
    "hiring": false,
    "featured": false,
    "careersUrl": "https://www.kcyberexperts.com/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://www.kcyberexperts.com",
    "logoUrl": "https://www.google.com/s2/favicons?domain=kcyberexperts.com&sz=128",
    "tags": [
      "Cybersecurity",
      "VAPT",
      "Digital Forensics",
      "SOC",
      "Information Security"
    ]
  },
  {
    "id": 38,
    "name": "Infocryon",
    "slug": "infocryon",
    "websiteUrl": "https://infocryon.com",
    "linkedinUrl": "https://www.linkedin.com/company/infocryon",
    "descriptionShort": "Threat intelligence, cybersecurity audit, web penetration testing, and IT security consulting.",
    "descriptionLong": "Infocryon is an information security consultancy based in Trimurti Nagar, Nagpur. They assist businesses in fortifying web applications, enterprise networks, and cloud endpoints against cyber threats through systematic vulnerability assessments and security architectures.",
    "sector": "Cybersecurity",
    "companyType": "IT Services",
    "stage": "BOOTSTRAPPED",
    "foundedYear": 2020,
    "teamSize": "11-50",
    "locationName": "Trimurti Nagar",
    "address": "Trimurti Nagar, Ring Road, Nagpur, Maharashtra 440022",
    "latitude": "21.1180",
    "longitude": "79.0480",
    "hiring": false,
    "featured": false,
    "careersUrl": "https://infocryon.com/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://infocryon.com",
    "logoUrl": "https://www.google.com/s2/favicons?domain=infocryon.com&sz=128",
    "tags": [
      "Cybersecurity",
      "Penetration Testing",
      "Security Audits",
      "Network Security"
    ]
  },
  {
    "id": 39,
    "name": "CyberBugs",
    "slug": "cyberbugs",
    "websiteUrl": "https://www.cyberbugs.in",
    "linkedinUrl": "https://www.linkedin.com/company/cyberbugs-info",
    "descriptionShort": "Cybersecurity testing, ethical hacking, digital forensics, and corporate security workshops.",
    "descriptionLong": "CyberBugs is a cybersecurity and digital defense company located on Ghat Road, Nagpur. The team conducts vulnerability management, cyber crime investigation support, and ethical hacking training to safeguard organizations across Central India.",
    "sector": "Cybersecurity",
    "companyType": "IT Services",
    "stage": "BOOTSTRAPPED",
    "foundedYear": 2017,
    "teamSize": "11-50",
    "locationName": "Ghat Road",
    "address": "Ghat Road, Cotton Market, Nagpur, Maharashtra 440018",
    "latitude": "21.1415",
    "longitude": "79.0910",
    "hiring": false,
    "featured": false,
    "careersUrl": "https://www.cyberbugs.in/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://www.cyberbugs.in",
    "logoUrl": "https://www.google.com/s2/favicons?domain=cyberbugs.in&sz=128",
    "tags": [
      "Cybersecurity",
      "Ethical Hacking",
      "Forensics",
      "Security Testing"
    ]
  },
  {
    "id": 40,
    "name": "Zeta Softech",
    "slug": "zeta-softech",
    "websiteUrl": "https://zetasoftech.com",
    "linkedinUrl": "https://www.linkedin.com/company/zeta-softech-pvt.-ltd.",
    "descriptionShort": "BPO, GIS spatial mapping, log digitization, and engineering drawing processing provider in Nagpur.",
    "descriptionLong": "Zeta Softech Pvt. Ltd. is an established knowledge-based ITES and digital processing provider operating near Nagpur IT Park. Specializing in oil well log digitization, GIS mapping, and engineering conversion for global oil, energy, and engineering corporations.",
    "sector": "IT Services",
    "companyType": "IT/ITES",
    "stage": "GROWTH",
    "foundedYear": 2004,
    "teamSize": "51-200",
    "locationName": "IT Park",
    "address": "Subhash Nagar, Opposite IT Park, Nagpur, Maharashtra 440022",
    "latitude": "21.1270",
    "longitude": "79.0530",
    "hiring": true,
    "featured": false,
    "careersUrl": "https://zetasoftech.com/career",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://zetasoftech.com",
    "logoUrl": "https://www.google.com/s2/favicons?domain=zetasoftech.com&sz=128",
    "tags": [
      "IT/ITES",
      "GIS Mapping",
      "Digitization",
      "BPO",
      "Data Engineering"
    ]
  },
  {
    "id": 41,
    "name": "TechQuadra Software Solutions",
    "slug": "techquadra-software-solutions",
    "websiteUrl": "https://www.techquadra.com",
    "linkedinUrl": "https://www.linkedin.com/company/techquadra-software-solutions",
    "descriptionShort": "End-to-end software development, web & mobile engineering, and AI/ML solutions in Pratap Nagar.",
    "descriptionLong": "TechQuadra Software Solutions is a full-cycle software engineering company founded in 2014 in Nagpur. They build custom web platforms, cross-platform mobile apps, AI/ML automations, and enterprise digital solutions for international and domestic clients.",
    "sector": "Software",
    "companyType": "IT Services",
    "stage": "BOOTSTRAPPED",
    "foundedYear": 2014,
    "teamSize": "11-50",
    "locationName": "Pratap Nagar",
    "address": "Jivan Chhaya Society, Deendayal Nagar, Pratap Nagar, Nagpur, Maharashtra 440022",
    "latitude": "21.1147",
    "longitude": "79.0521",
    "hiring": true,
    "featured": false,
    "careersUrl": "https://www.techquadra.com/career",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://www.techquadra.com",
    "logoUrl": "https://www.google.com/s2/favicons?domain=techquadra.com&sz=128",
    "tags": [
      "Software",
      "Web Development",
      "Mobile Apps",
      "AI/ML",
      "Custom Software"
    ]
  },
  {
    "id": 42,
    "name": "Bloom Consulting Services",
    "slug": "bloom-consulting-services",
    "websiteUrl": "https://www.bloomcs.com",
    "linkedinUrl": "https://www.linkedin.com/company/bloom-consulting-services",
    "descriptionShort": "Cloud-native application engineering, Microsoft Azure solutions, AI, and DevOps consultancy.",
    "descriptionLong": "Bloom Consulting Services is an active IT and cloud consulting firm headquartered in Nagpur with offices in the US and Singapore. They specialize in cloud-native application engineering, Azure infrastructure, DevOps pipelines, and dedicated software development teams.",
    "sector": "IT Services",
    "companyType": "IT Services",
    "stage": "BOOTSTRAPPED",
    "foundedYear": 2015,
    "teamSize": "51-200",
    "locationName": "Katol Road",
    "address": "118/119 KT Nagar, Near KT Nagar Garden, Katol Road, Nagpur, Maharashtra 440013",
    "latitude": "21.1712",
    "longitude": "79.0435",
    "hiring": true,
    "featured": false,
    "careersUrl": "https://www.bloomcs.com/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://www.bloomcs.com",
    "logoUrl": "https://www.google.com/s2/favicons?domain=bloomcs.com&sz=128",
    "tags": [
      "Cloud Native",
      "Azure",
      "DevOps",
      "AI Solutions",
      "IT Services"
    ]
  },
  {
    "id": 43,
    "name": "Trivo IT Solutions",
    "slug": "trivo-it-solutions",
    "websiteUrl": "https://trivo.in",
    "linkedinUrl": "https://www.linkedin.com/company/trivo-it-solutions",
    "descriptionShort": "Travel technology solutions, web development, and performance digital marketing agency.",
    "descriptionLong": "Trivo IT Solutions Private Limited, incorporated in 2018 in Nagpur, is a digital agency specialized in travel technology portals, e-commerce web applications, and ROI-driven performance digital marketing.",
    "sector": "Media & Marketing",
    "companyType": "IT Services",
    "stage": "BOOTSTRAPPED",
    "foundedYear": 2018,
    "teamSize": "11-50",
    "locationName": "Koradi Road",
    "address": "Bharatwada, Koradi Road, Nagpur, Maharashtra 440030",
    "latitude": "21.2050",
    "longitude": "79.0820",
    "hiring": false,
    "featured": false,
    "careersUrl": "https://trivo.in/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://trivo.in",
    "logoUrl": "https://www.google.com/s2/favicons?domain=trivo.in&sz=128",
    "tags": [
      "Digital Marketing",
      "Web Development",
      "Travel Tech",
      "SEO"
    ]
  },
  {
    "id": 44,
    "name": "Inputiv",
    "slug": "inputiv",
    "websiteUrl": "https://inputiv.com",
    "linkedinUrl": "https://www.linkedin.com/company/inputiv",
    "descriptionShort": "White-label IT infrastructure, cloud migrations, and AWS/Azure support engineering headquartered in Nagpur.",
    "descriptionLong": "Inputiv provides specialized white-label IT support and cloud engineering for international Managed Service Providers (MSPs). Headquartered in Nagpur, Inputiv delivers L1-L3 helpdesk support, cloud migrations, and automation infrastructure.",
    "sector": "IT Services",
    "companyType": "IT Services",
    "stage": "BOOTSTRAPPED",
    "foundedYear": 2021,
    "teamSize": "11-50",
    "locationName": "IT Park",
    "address": "Near IT Park, Pratap Nagar, Nagpur, Maharashtra 440022",
    "latitude": "21.1278",
    "longitude": "79.0512",
    "hiring": true,
    "featured": false,
    "careersUrl": "https://inputiv.com/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://inputiv.com",
    "logoUrl": "https://www.google.com/s2/favicons?domain=inputiv.com&sz=128",
    "tags": [
      "Cloud",
      "AWS",
      "Azure",
      "MSP Support",
      "Infrastructure"
    ]
  },
  {
    "id": 45,
    "name": "Tantransh Solutions",
    "slug": "tantransh-solutions",
    "websiteUrl": "https://tantranshsolutions.com",
    "linkedinUrl": "https://www.linkedin.com/company/tantransh-solutions",
    "descriptionShort": "Customized software development, web applications, and mobile solutions in Bajaj Nagar.",
    "descriptionLong": "Tantransh Solutions is a software development company founded in 2016 in Nagpur. Operating from Bajaj Nagar, they develop custom ERPs, business web applications, and mobile apps for small-to-mid sized commercial enterprises.",
    "sector": "Software",
    "companyType": "IT Services",
    "stage": "BOOTSTRAPPED",
    "foundedYear": 2016,
    "teamSize": "11-50",
    "locationName": "Bajaj Nagar",
    "address": "Plot No. 194, Abhyankar Nagar Rd, Bajaj Nagar, Nagpur, Maharashtra 440010",
    "latitude": "21.1270",
    "longitude": "79.0635",
    "hiring": false,
    "featured": false,
    "careersUrl": "https://tantranshsolutions.com/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://tantranshsolutions.com",
    "logoUrl": "https://www.google.com/s2/favicons?domain=tantranshsolutions.com&sz=128",
    "tags": [
      "Software",
      "Custom ERP",
      "Web Development",
      "Mobile Apps"
    ]
  },
  {
    "id": 46,
    "name": "Hesten Solutions",
    "slug": "hesten-solutions",
    "websiteUrl": "https://hestensolutions.com",
    "linkedinUrl": "https://www.linkedin.com/company/hesten-solutions",
    "descriptionShort": "Mobile app engineering, web solutions, and digital growth services in Manewada.",
    "descriptionLong": "Hesten Solutions Private Limited delivers cross-platform mobile apps (Flutter, React Native), full-stack web applications, and search optimization services for clients across retail and service industries.",
    "sector": "Software",
    "companyType": "IT Services",
    "stage": "BOOTSTRAPPED",
    "foundedYear": 2021,
    "teamSize": "11-50",
    "locationName": "Manewada",
    "address": "Plot No. 32/1, R.M.S. Colony, Durga Nagar, Manewada Road, Nagpur, Maharashtra 440024",
    "latitude": "21.1090",
    "longitude": "79.1020",
    "hiring": false,
    "featured": false,
    "careersUrl": "https://hestensolutions.com/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://hestensolutions.com",
    "logoUrl": "https://www.google.com/s2/favicons?domain=hestensolutions.com&sz=128",
    "tags": [
      "Mobile Apps",
      "Flutter",
      "Web Development",
      "Digital Services"
    ]
  },
  {
    "id": 47,
    "name": "Pragma Softwares",
    "slug": "pragma-softwares",
    "websiteUrl": "https://www.pragmasoftwares.com",
    "linkedinUrl": "https://www.linkedin.com/company/pragma-softwares",
    "descriptionShort": "Web engineering, cloud consulting, mobile apps, and custom software systems in Kalamna.",
    "descriptionLong": "Pragma Softwares is an IT services agency based in Kalamna, Nagpur. They craft tailored web portals, business process automations, and cloud-hosted systems for regional and national businesses.",
    "sector": "Software",
    "companyType": "IT Services",
    "stage": "BOOTSTRAPPED",
    "foundedYear": 2016,
    "teamSize": "1-10",
    "locationName": "Kalamna",
    "address": "Kalamna Road, Nagpur, Maharashtra 440026",
    "latitude": "21.1680",
    "longitude": "79.1350",
    "hiring": false,
    "featured": false,
    "careersUrl": "https://www.pragmasoftwares.com/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://www.pragmasoftwares.com",
    "logoUrl": "https://www.google.com/s2/favicons?domain=pragmasoftwares.com&sz=128",
    "tags": [
      "Web Engineering",
      "Cloud",
      "Custom Software",
      "IT Consulting"
    ]
  },
  {
    "id": 48,
    "name": "ICEICO Technologies",
    "slug": "iceico-technologies",
    "websiteUrl": "https://iceico.in",
    "linkedinUrl": "https://www.linkedin.com/company/iceico-technologies-pvt-ltd",
    "descriptionShort": "Custom software engineering, enterprise web & mobile application development at IT Park.",
    "descriptionLong": "ICEICO Technologies Pvt. Ltd. was founded in 2017 in Nagpur by Rajat Salve and Sagar Sitewar. The company delivers full-cycle software engineering, cross-platform mobile apps, cloud hosting, and enterprise digital transformation.",
    "sector": "Software",
    "companyType": "IT Services",
    "stage": "BOOTSTRAPPED",
    "foundedYear": 2017,
    "teamSize": "51-200",
    "locationName": "IT Park",
    "address": "Subhash Nagar, IT Park Road, Nagpur, Maharashtra 440022",
    "latitude": "21.1275",
    "longitude": "79.0535",
    "hiring": true,
    "featured": false,
    "careersUrl": "https://iceico.in/careers/",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://iceico.in",
    "logoUrl": "https://www.google.com/s2/favicons?domain=iceico.in&sz=128",
    "tags": [
      "Software Engineering",
      "Mobile Apps",
      "Web Development",
      "IT Services"
    ]
  },
  {
    "id": 49,
    "name": "Atina Technology",
    "slug": "atina-technology",
    "websiteUrl": "https://atinatechnology.in",
    "linkedinUrl": "https://www.linkedin.com/company/atina-technology",
    "descriptionShort": "Custom web development, business applications, and IT software systems on Central Avenue.",
    "descriptionLong": "Atina Technology Pvt. Ltd. is a Nagpur software development company based on CA Road. They build modern web applications, e-commerce stores, and business inventory management solutions for clients across Maharashtra.",
    "sector": "Software",
    "companyType": "IT Services",
    "stage": "BOOTSTRAPPED",
    "foundedYear": 2017,
    "teamSize": "11-50",
    "locationName": "Central Avenue",
    "address": "Plot No. 3A, 2nd Floor, Madhav Tower, Chapru Nagar Square, CA Road, Nagpur 440008",
    "latitude": "21.1500",
    "longitude": "79.1180",
    "hiring": false,
    "featured": false,
    "careersUrl": "https://atinatechnology.in/careers/",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://atinatechnology.in",
    "logoUrl": "https://www.google.com/s2/favicons?domain=atinatechnology.in&sz=128",
    "tags": [
      "Software",
      "Web Development",
      "Ecommerce",
      "Business Portals"
    ]
  },
  {
    "id": 50,
    "name": "Apps n Webs",
    "slug": "apps-n-webs",
    "websiteUrl": "https://appsnwebs.com",
    "linkedinUrl": "https://www.linkedin.com/company/apps-n-webs",
    "descriptionShort": "Full-service digital product studio building web applications, mobile platforms, and e-commerce.",
    "descriptionLong": "Apps n Webs is an active technology studio in Nagpur specializing in responsive web platforms, iOS/Android mobile apps, and headless e-commerce architectures. They work closely with local startups and regional brands to build scalable digital solutions.",
    "sector": "Software",
    "companyType": "IT Services",
    "stage": "BOOTSTRAPPED",
    "foundedYear": 2015,
    "teamSize": "11-50",
    "locationName": "Civil Lines",
    "address": "Civil Lines, Nagpur, Maharashtra 440001",
    "latitude": "21.1540",
    "longitude": "79.0750",
    "hiring": true,
    "featured": false,
    "careersUrl": "https://appsnwebs.com/career",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://appsnwebs.com",
    "logoUrl": "https://www.google.com/s2/favicons?domain=appsnwebs.com&sz=128",
    "tags": [
      "Web Development",
      "Mobile Apps",
      "UI/UX",
      "Full Stack",
      "Ecommerce"
    ]
  },
  {
    "id": 51,
    "name": "Nonstop Agency",
    "slug": "nonstop-agency",
    "websiteUrl": "https://nonstop.agency",
    "linkedinUrl": "https://www.linkedin.com/company/nonstop-agency",
    "descriptionShort": "Creative technology and digital performance agency scaling brands across Central India.",
    "descriptionLong": "Nonstop Agency is a high-energy media and digital growth agency operating in Dharampeth, Nagpur. They combine creative design, digital performance marketing, content production, and tech automation to help modern brands expand their reach.",
    "sector": "Media & Marketing",
    "companyType": "IT/ITES",
    "stage": "BOOTSTRAPPED",
    "foundedYear": 2018,
    "teamSize": "11-50",
    "locationName": "Dharampeth",
    "address": "West High Court Road, Dharampeth, Nagpur, Maharashtra 440010",
    "latitude": "21.1440",
    "longitude": "79.0740",
    "hiring": true,
    "featured": false,
    "careersUrl": "https://nonstop.agency/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://nonstop.agency",
    "logoUrl": "https://www.google.com/s2/favicons?domain=nonstop.agency&sz=128",
    "tags": [
      "Media & Marketing",
      "Growth",
      "Branding",
      "Performance Marketing"
    ]
  },
  {
    "id": 52,
    "name": "PSK Technologies",
    "slug": "psk-technologies",
    "websiteUrl": "https://www.psktechnologies.co.in",
    "linkedinUrl": "https://www.linkedin.com/company/psk-technologies",
    "descriptionShort": "IT services and software consultancy providing web development, cloud hosting, and tech support.",
    "descriptionLong": "PSK Technologies is an IT software firm operating from Nagpur IT Park since 2011. They deliver custom web applications, Linux server management, cloud infrastructure setup, and corporate software solutions.",
    "sector": "Software",
    "companyType": "IT Services",
    "stage": "BOOTSTRAPPED",
    "foundedYear": 2011,
    "teamSize": "11-50",
    "locationName": "IT Park",
    "address": "IT Park, Gayatri Nagar, Parsodi, Nagpur, Maharashtra 440022",
    "latitude": "21.1260",
    "longitude": "79.0495",
    "hiring": false,
    "featured": false,
    "careersUrl": "https://www.psktechnologies.co.in/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://www.psktechnologies.co.in",
    "logoUrl": "https://www.google.com/s2/favicons?domain=psktechnologies.co.in&sz=128",
    "tags": [
      "Software",
      "Web Development",
      "Cloud Hosting",
      "IT Support"
    ]
  },
  {
    "id": 53,
    "name": "Flappic Technologies",
    "slug": "flappic-technologies",
    "websiteUrl": "https://flappic.com",
    "linkedinUrl": "https://www.linkedin.com/company/flappic-technologies",
    "descriptionShort": "Product engineering and web design firm crafting cloud software and custom CRM tools.",
    "descriptionLong": "Flappic Technologies is a software boutique based in Pratap Nagar, Nagpur. They build modern client portals, lightweight CRM extensions, and interactive web tools for startups and SMEs.",
    "sector": "Software",
    "companyType": "IT Services",
    "stage": "BOOTSTRAPPED",
    "foundedYear": 2019,
    "teamSize": "11-50",
    "locationName": "Pratap Nagar",
    "address": "Pratap Nagar, Nagpur, Maharashtra 440022",
    "latitude": "21.1200",
    "longitude": "79.0550",
    "hiring": false,
    "featured": false,
    "careersUrl": "https://flappic.com/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://flappic.com",
    "logoUrl": "https://www.google.com/s2/favicons?domain=flappic.com&sz=128",
    "tags": [
      "Software",
      "CRM",
      "Web Applications",
      "Product Design"
    ]
  },
  {
    "id": 54,
    "name": "CYBOT-X Technologies",
    "slug": "cybot-x-technologies",
    "websiteUrl": "https://cybotx.com",
    "linkedinUrl": "https://www.linkedin.com/company/cybot-x",
    "descriptionShort": "Cybersecurity and IT systems development company based in Civil Lines, Nagpur.",
    "descriptionLong": "CYBOT-X Technologies delivers cybersecurity audits, enterprise IT automation, and web security consulting. Headquartered in Civil Lines, the team supports regional businesses with proactive cyber protection.",
    "sector": "Cybersecurity",
    "companyType": "IT Services",
    "stage": "BOOTSTRAPPED",
    "foundedYear": 2020,
    "teamSize": "11-50",
    "locationName": "Civil Lines",
    "address": "Civil Lines, Nagpur, Maharashtra 440001",
    "latitude": "21.1530",
    "longitude": "79.0770",
    "hiring": false,
    "featured": false,
    "careersUrl": "https://cybotx.com/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://cybotx.com",
    "logoUrl": "https://www.google.com/s2/favicons?domain=cybotx.com&sz=128",
    "tags": [
      "Cybersecurity",
      "Automation",
      "Security Audits",
      "IT Services"
    ]
  },
  {
    "id": 55,
    "name": "Exorbis Tech",
    "slug": "exorbis-tech",
    "websiteUrl": "https://exorbistech.com",
    "linkedinUrl": "https://www.linkedin.com/company/exorbis-tech",
    "descriptionShort": "Custom web development and IT infrastructure services company operating in Sadar.",
    "descriptionLong": "Exorbis Tech provides full-stack web development, API integrations, and ongoing IT support from Residency Road, Sadar. They help local businesses establish scalable digital storefronts and portals.",
    "sector": "IT Services",
    "companyType": "IT Services",
    "stage": "BOOTSTRAPPED",
    "foundedYear": 2017,
    "teamSize": "11-50",
    "locationName": "Sadar",
    "address": "Residency Road, Sadar, Nagpur, Maharashtra 440001",
    "latitude": "21.1590",
    "longitude": "79.0830",
    "hiring": false,
    "featured": false,
    "careersUrl": "https://exorbistech.com/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://exorbistech.com",
    "logoUrl": "https://www.google.com/s2/favicons?domain=exorbistech.com&sz=128",
    "tags": [
      "IT Services",
      "Web Development",
      "API Integration",
      "Support"
    ]
  },
  {
    "id": 56,
    "name": "Digitron Software",
    "slug": "digitron-software",
    "websiteUrl": "https://digitronsoftware.com",
    "linkedinUrl": "https://www.linkedin.com/company/digitron-software",
    "descriptionShort": "Enterprise software, accounting solutions, and business IT services in Ramdaspeth.",
    "descriptionLong": "Digitron Software is a software consultancy in Ramdaspeth, Nagpur. Specializing in customized business billing solutions, inventory systems, and commercial database setups for trading and service firms.",
    "sector": "Software",
    "companyType": "IT Services",
    "stage": "BOOTSTRAPPED",
    "foundedYear": 2016,
    "teamSize": "11-50",
    "locationName": "Ramdaspeth",
    "address": "Canal Road, Ramdaspeth, Nagpur, Maharashtra 440010",
    "latitude": "21.1380",
    "longitude": "79.0710",
    "hiring": false,
    "featured": false,
    "careersUrl": "https://digitronsoftware.com/careers",
    "verificationStatus": "VERIFIED",
    "lastVerifiedAt": "2026-09-22",
    "verificationSource": "https://digitronsoftware.com",
    "logoUrl": "https://www.google.com/s2/favicons?domain=digitronsoftware.com&sz=128",
    "tags": [
      "Software",
      "Business Portals",
      "Billing Systems",
      "Database Design"
    ]
  }
];

export const FOUNDERS_DATA: FounderData[] = [
  {
    "id": 1,
    "name": "Shashank Dixit",
    "slug": "shashank-dixit",
    "role": "Founder & CEO",
    "companySlug": "infocepts",
    "companyName": "InfoCepts",
    "bio": "Founder and CEO of InfoCepts, one of Nagpur's premier homegrown global data analytics enterprises. Shashank is an alumnus of VNIT Nagpur and has spent over two decades building Central India's leading tech firm.",
    "linkedinUrl": "https://www.linkedin.com/in/shashankdixit",
    "location": "Nagpur"
  },
  {
    "id": 2,
    "name": "Dr. Anand Deshpande",
    "slug": "anand-deshpande",
    "role": "Founder & Chairman",
    "companySlug": "persistent-systems",
    "companyName": "Persistent Systems",
    "bio": "Founder and Chairman of Persistent Systems, and one of the defining architects of Maharashtra's software engineering industry. A staunch advocate for tech decentralization beyond tier-1 metros.",
    "linkedinUrl": "https://www.linkedin.com/in/ananddeshpande",
    "location": "Nagpur / Pune"
  },
  {
    "id": 3,
    "name": "Hemant Chafale",
    "slug": "hemant-chafale",
    "role": "Founder, MD & CEO",
    "companySlug": "trust-fintech",
    "companyName": "Trust Fintech Limited",
    "bio": "Pioneering banking software entrepreneur who founded Trust Fintech Limited in 1998, successfully taking it to an NSE Emerge IPO in 2024.",
    "linkedinUrl": "https://www.linkedin.com/company/trust-fintech-limited",
    "location": "Nagpur"
  },
  {
    "id": 4,
    "name": "Sham Somani",
    "slug": "sham-somani",
    "role": "Founder & Managing Director",
    "companySlug": "mastersoft-erp-solutions",
    "companyName": "MasterSoft ERP Solutions",
    "bio": "Visionary education technologist who founded MasterSoft ERP in 1995, transforming it into India's largest educational campus automation software company.",
    "linkedinUrl": "https://www.linkedin.com/company/mastersofterp",
    "location": "Nagpur"
  },
  {
    "id": 5,
    "name": "Ashutosh Mundhada",
    "slug": "ashutosh-mundhada",
    "role": "Co-Founder & CEO",
    "companySlug": "yourphysio",
    "companyName": "YourPhysio (Fix Health)",
    "bio": "Healthcare entrepreneur who co-founded YourPhysio (Fix Health), leading digital musculoskeletal care and securing venture capital from Titan Capital and Better Capital.",
    "linkedinUrl": "https://www.linkedin.com/company/yourphysio",
    "location": "Nagpur"
  },
  {
    "id": 6,
    "name": "Sachin Pande",
    "slug": "sachin-pande",
    "role": "Promoter & Managing Director",
    "companySlug": "virtual-galaxy-infotech",
    "companyName": "Virtual Galaxy Infotech (VGIL)",
    "bio": "Fintech innovator and promoter behind Virtual Galaxy Infotech, architect of the E-Banker Core Banking solution implemented across 150+ financial institutions.",
    "linkedinUrl": "https://www.linkedin.com/company/virtual-galaxy-infotech-ltd",
    "location": "Nagpur"
  },
  {
    "id": 7,
    "name": "Manish Peshkar",
    "slug": "manish-peshkar",
    "role": "Promoter & Director",
    "companySlug": "micropro-software-solutions",
    "companyName": "Micropro Software Solutions Limited",
    "bio": "Director and promoter of NSE Emerge-listed Micropro Software Solutions, delivering e-governance and HospyCare healthcare ERP software for three decades.",
    "linkedinUrl": "https://www.linkedin.com/company/microproindia",
    "location": "Nagpur"
  },
  {
    "id": 8,
    "name": "Rajkumar Malu",
    "slug": "rajkumar-malu",
    "role": "Founder & CEO",
    "companySlug": "frikly",
    "companyName": "Frikly",
    "bio": "E-commerce founder who established Frikly in 2022, rapidly scaling it into one of Central India's fastest-growing interior materials marketplaces.",
    "linkedinUrl": "https://www.linkedin.com/company/frikly",
    "location": "Nagpur"
  },
  {
    "id": 9,
    "name": "Deepak Menaria",
    "slug": "deepak-menaria",
    "role": "Founder & Chief Idea Farmer",
    "companySlug": "lemon-ideas",
    "companyName": "Lemon Ideas Innovations",
    "bio": "Ecosystem builder and social entrepreneur who founded Lemon Ideas in 2013 to nurture early-stage startups, innovation cohorts, and youth entrepreneurship in Vidarbha.",
    "linkedinUrl": "https://www.linkedin.com/company/lemon-ideas",
    "location": "Nagpur"
  },
  {
    "id": 10,
    "name": "Shekhar Hatwar",
    "slug": "shekhar-hatwar",
    "role": "Co-Founder & Director",
    "companySlug": "techquadra-software-solutions",
    "companyName": "TechQuadra Software Solutions",
    "bio": "Software engineering leader who co-founded TechQuadra Software Solutions in 2014, leading full-stack and mobile app delivery teams for international clients.",
    "linkedinUrl": "https://www.linkedin.com/company/techquadra-software-solutions",
    "location": "Nagpur"
  },
  {
    "id": 11,
    "name": "Manish Kungwani",
    "slug": "manish-kungwani",
    "role": "Co-Founder & Director",
    "companySlug": "bloom-consulting-services",
    "companyName": "Bloom Consulting Services",
    "bio": "Cloud solutions leader who co-founded Bloom Consulting Services in 2015, driving enterprise Azure and cloud-native application modernization practices.",
    "linkedinUrl": "https://www.linkedin.com/company/bloom-consulting-services",
    "location": "Nagpur"
  },
  {
    "id": 12,
    "name": "Rajat Salve",
    "slug": "rajat-salve",
    "role": "Co-Founder & Director",
    "companySlug": "iceico-technologies",
    "companyName": "ICEICO Technologies",
    "bio": "Co-founder of ICEICO Technologies, delivering enterprise software, mobile applications, and digital transformation services from Nagpur IT Park.",
    "linkedinUrl": "https://www.linkedin.com/company/iceico-technologies-pvt-ltd",
    "location": "Nagpur"
  }
];

export const JOBS_DATA: JobData[] = [
  {
    id: 1,
    title: "Senior Data Engineer",
    slug: "senior-data-engineer-infocepts",
    companySlug: "infocepts",
    companyName: "InfoCepts",
    description: "We are seeking an experienced Senior Data Engineer to architect and scale real-time analytics data pipelines. You will work directly with global enterprise accounts using Apache Spark, Snowflake, Airflow, and AWS data platforms.",
    location: "Nagpur",
    remoteType: "HYBRID",
    employmentType: "FULL_TIME",
    experienceMin: 3,
    experienceMax: 7,
    salaryMin: 1200000,
    salaryMax: 2200000,
    currency: "INR",
    skills: "Python, Spark, SQL, Airflow, AWS, Snowflake, Data Warehousing",
    applicationUrl: "https://www.infocepts.com/careers",
    department: "Engineering",
    postedAt: "2026-09-15",
    expiresAt: "2026-10-30",
    featured: true,
  },
  {
    id: 2,
    title: "AI/ML Engineer",
    slug: "ai-ml-engineer-infocepts",
    companySlug: "infocepts",
    companyName: "InfoCepts",
    description: "Join our cutting-edge AI COE to build deep learning models, fine-tune open source LLMs, and implement enterprise Retrieval-Augmented Generation (RAG) architectures for Fortune 500 clients.",
    location: "Nagpur",
    remoteType: "HYBRID",
    employmentType: "FULL_TIME",
    experienceMin: 2,
    experienceMax: 5,
    salaryMin: 1000000,
    salaryMax: 2000000,
    currency: "INR",
    skills: "Python, PyTorch, TensorFlow, MLOps, LLMs, LangChain, RAG",
    applicationUrl: "https://www.infocepts.com/careers",
    department: "AI/ML",
    postedAt: "2026-09-18",
    expiresAt: "2026-10-31",
    featured: true,
  },
  {
    id: 3,
    title: "Full Stack Developer",
    slug: "full-stack-developer-immverse-ai",
    companySlug: "immverse-ai",
    companyName: "Immverse AI",
    description: "Looking for an energetic Full Stack Developer to build our next-generation AI web interfaces. You will work with React, Next.js, Node.js, Python FastAPI, and vector databases.",
    location: "Nagpur",
    remoteType: "ON_SITE",
    employmentType: "FULL_TIME",
    experienceMin: 1,
    experienceMax: 4,
    salaryMin: 600000,
    salaryMax: 1400000,
    currency: "INR",
    skills: "React, Next.js, Node.js, Python, TypeScript, PostgreSQL, Tailwind",
    applicationUrl: "https://www.immverseai.com",
    department: "Engineering",
    postedAt: "2026-09-20",
    expiresAt: "2026-10-25",
    featured: true,
  },
  {
    id: 4,
    title: "Software Engineer - Cloud & Java",
    slug: "software-engineer-persistent-systems",
    companySlug: "persistent-systems",
    companyName: "Persistent Systems",
    description: "Develop enterprise-grade microservices and cloud solutions for healthcare and fintech clients. Solid fundamentals in Java, Spring Boot, and RESTful API architecture required.",
    location: "Nagpur",
    remoteType: "HYBRID",
    employmentType: "FULL_TIME",
    experienceMin: 1,
    experienceMax: 3,
    salaryMin: 500000,
    salaryMax: 1000000,
    currency: "INR",
    skills: "Java, Spring Boot, Microservices, SQL, Docker, AWS",
    applicationUrl: "https://www.persistent.com/careers",
    department: "Engineering",
    postedAt: "2026-09-10",
    expiresAt: "2026-10-15",
    featured: false,
  },
  {
    id: 5,
    title: "Cloud Solutions Architect",
    slug: "cloud-solutions-architect-tcs-nagpur",
    companySlug: "tcs-nagpur",
    companyName: "TCS Nagpur",
    description: "Design resilient multicloud architectures for Tier-1 global clients. Hands-on experience with Kubernetes, Terraform, AWS/GCP, and disaster recovery architectures required.",
    location: "Nagpur",
    remoteType: "HYBRID",
    employmentType: "FULL_TIME",
    experienceMin: 5,
    experienceMax: 12,
    salaryMin: 2000000,
    salaryMax: 3500000,
    currency: "INR",
    skills: "AWS, Azure, GCP, Kubernetes, Terraform, CI/CD, Enterprise Architecture",
    applicationUrl: "https://www.tcs.com/careers",
    department: "Architecture",
    postedAt: "2026-09-12",
    expiresAt: "2026-10-20",
    featured: false,
  },
  {
    id: 6,
    title: "React Developer",
    slug: "react-developer-flappic",
    companySlug: "flappic-technologies",
    companyName: "Flappic Technologies",
    description: "Build clean, pixel-perfect frontend experiences using React, TypeScript, and modern styling libraries. Great opportunity to work on varied client and SaaS projects.",
    location: "Nagpur",
    remoteType: "ON_SITE",
    employmentType: "FULL_TIME",
    experienceMin: 1,
    experienceMax: 3,
    salaryMin: 400000,
    salaryMax: 900000,
    currency: "INR",
    skills: "React, Next.js, TypeScript, Tailwind CSS, Redux, REST APIs",
    applicationUrl: "https://www.flappic.com",
    department: "Engineering",
    postedAt: "2026-09-19",
    expiresAt: "2026-10-25",
    featured: false,
  },
  {
    id: 7,
    title: "Product Manager - B2B SaaS",
    slug: "product-manager-excellon",
    companySlug: "excellon-software",
    companyName: "Excellon Software",
    description: "Own the roadmap and feature execution for our leading Distribution Management System. Work with enterprise clients, UX designers, and engineering leads to launch high-impact features.",
    location: "Nagpur",
    remoteType: "ON_SITE",
    employmentType: "FULL_TIME",
    experienceMin: 3,
    experienceMax: 8,
    salaryMin: 1200000,
    salaryMax: 2500000,
    currency: "INR",
    skills: "Product Management, B2B SaaS, Analytics, Agile, User Stories, Roadmapping",
    applicationUrl: "https://www.aborad.com/careers",
    department: "Product",
    postedAt: "2026-09-17",
    expiresAt: "2026-10-25",
    featured: false,
  },
  {
    id: 8,
    title: "Frontend Developer Intern",
    slug: "frontend-developer-intern-coursefinder",
    companySlug: "coursefinder-ai",
    companyName: "Coursefinder.ai",
    description: "6-month paid internship with opportunity for full-time conversion. Build real-world features using React and Tailwind CSS in a fast-moving AI edtech environment.",
    location: "Nagpur",
    remoteType: "HYBRID",
    employmentType: "INTERNSHIP",
    experienceMin: 0,
    experienceMax: 1,
    salaryMin: 15000,
    salaryMax: 25000,
    currency: "INR",
    skills: "HTML, CSS, JavaScript, React, Git, Responsive Design",
    applicationUrl: "https://www.coursefinder.ai",
    department: "Engineering",
    postedAt: "2026-09-21",
    expiresAt: "2026-11-01",
    featured: true,
  },
  {
    id: 9,
    title: "DevOps Engineer",
    slug: "devops-engineer-hcltech-nagpur",
    companySlug: "hcltech-nagpur",
    companyName: "HCLTech Nagpur",
    description: "Maintain, automate, and optimize continuous deployment systems, observability stacks (Prometheus/Grafana), and cloud infrastructure in MIHAN Nagpur.",
    location: "Nagpur",
    remoteType: "HYBRID",
    employmentType: "FULL_TIME",
    experienceMin: 2,
    experienceMax: 6,
    salaryMin: 800000,
    salaryMax: 1800000,
    currency: "INR",
    skills: "Docker, Kubernetes, Jenkins, GitHub Actions, AWS, Terraform, Linux",
    applicationUrl: "https://www.hcltech.com/careers",
    department: "DevOps",
    postedAt: "2026-09-16",
    expiresAt: "2026-10-30",
    featured: false,
  },
  {
    id: 10,
    title: "UI/UX Designer",
    slug: "ui-ux-designer-globallogic",
    companySlug: "globallogic-nagpur",
    companyName: "GlobalLogic Nagpur",
    description: "Conduct user research, design wireframes, design systems, and interactive prototypes for leading consumer mobile apps and enterprise portals.",
    location: "Nagpur",
    remoteType: "HYBRID",
    employmentType: "FULL_TIME",
    experienceMin: 2,
    experienceMax: 5,
    salaryMin: 800000,
    salaryMax: 1600000,
    currency: "INR",
    skills: "Figma, User Research, Wireframing, Prototyping, Design Systems, Usability Testing",
    applicationUrl: "https://www.globallogic.com/careers",
    department: "Design",
    postedAt: "2026-09-14",
    expiresAt: "2026-10-20",
    featured: false,
  },
];

export const EVENTS_DATA: EventData[] = [
  {
    id: 1,
    title: "Nagpur Tech Meetup #12",
    slug: "nagpur-tech-meetup-12",
    description: "Monthly tech meetup featuring talks on practical AI, micro-frontends, and building startups in Tier-2 Indian cities. Open to all software developers, designers, and founders in Nagpur.",
    eventType: "MEETUP",
    organizer: "Nagpur Tech Community",
    date: "2026-10-05",
    startTime: "6:00 PM",
    endTime: "9:00 PM",
    venue: "IIM Nagpur, MIHAN Campus",
    location: "MIHAN, Nagpur",
    registrationUrl: "https://lu.ma/nagpur-tech-meetup-12",
    price: "Free",
    featured: true,
  },
  {
    id: 2,
    title: "Hack Nagpur 2026",
    slug: "hack-nagpur-2026",
    description: "Central India's premier 48-hour student & developer hackathon. Build solutions across AI, Web3, FinTech, and CleanTech. Cash prize pool of ₹2,00,000 + cloud credits.",
    eventType: "HACKATHON",
    organizer: "VNIT Entrepreneurship Cell",
    date: "2026-10-18",
    startTime: "9:00 AM",
    endTime: "9:00 AM (Oct 20)",
    venue: "VNIT Campus Auditorium",
    location: "Ambazari, Nagpur",
    registrationUrl: "https://hacknagpur.com",
    price: "Free",
    featured: true,
  },
  {
    id: 3,
    title: "AI Workshop: Building with LLMs & Agents",
    slug: "ai-workshop-building-with-llms",
    description: "Hands-on masterclass on building real-world AI applications with Large Language Models. Learn prompt engineering, function calling, RAG pipelines, and local model inference.",
    eventType: "WORKSHOP",
    organizer: "eChai Nagpur & Immverse AI",
    date: "2026-10-10",
    startTime: "10:00 AM",
    endTime: "4:00 PM",
    venue: "CoWork Nagpur, Civil Lines",
    location: "Civil Lines, Nagpur",
    registrationUrl: "https://echai.org/events/nagpur",
    price: "₹499",
    featured: true,
  },
  {
    id: 4,
    title: "Nagpur Startup Demo Day Q4 2026",
    slug: "nagpur-startup-demo-day-q4-2026",
    description: "Quarterly demo day where 6 selected Nagpur-based seed startups pitch to angel investors, venture capitalists, and ecosystem leaders.",
    eventType: "DEMO_DAY",
    organizer: "IIM Nagpur InFED Incubator",
    date: "2026-10-25",
    startTime: "5:00 PM",
    endTime: "8:00 PM",
    venue: "IIM Nagpur Convention Hall",
    location: "MIHAN, Nagpur",
    registrationUrl: "https://iimn.ac.in/infed/events",
    price: "Free",
    featured: false,
  },
  {
    id: 5,
    title: "Women in Tech Nagpur Mixer",
    slug: "women-in-tech-nagpur-networking",
    description: "An evening of keynote talks, mentorship circles, and networking for women software engineers, product managers, and tech founders in Vidarbha.",
    eventType: "NETWORKING",
    organizer: "Women in Tech Nagpur",
    date: "2026-10-12",
    startTime: "4:00 PM",
    endTime: "7:00 PM",
    venue: "Radisson Blu Hotel, Wardha Road",
    location: "Wardha Road, Nagpur",
    registrationUrl: "https://womenintech-nagpur.org",
    price: "Free",
    featured: false,
  },
];

export const TALENT_DATA: TalentData[] = [
  {
    id: 1,
    name: "Aditya Deshmukh",
    slug: "aditya-deshmukh",
    title: "Senior Full Stack Engineer",
    bio: "VNIT graduate with 5 years experience building high-performance Next.js and Go microservices. Passionate about developer tooling and database optimization.",
    location: "Nagpur",
    primarySkills: ["TypeScript", "Next.js", "Go", "PostgreSQL", "Tailwind CSS", "Docker"],
    experienceYears: 5,
    openToWork: true,
    workPreference: "HYBRID",
    githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com",
    portfolioUrl: "https://aditya.dev",
  },
  {
    id: 2,
    name: "Snehal Patil",
    slug: "snehal-patil",
    title: "AI / Machine Learning Engineer",
    bio: "RCOEM alumnus specializing in PyTorch, NLP, and agentic workflows. Built production RAG pipelines and multimodal question-answering systems.",
    location: "Nagpur",
    primarySkills: ["Python", "PyTorch", "HuggingFace", "LangChain", "FastAPI", "Vector DBs"],
    experienceYears: 3,
    openToWork: true,
    workPreference: "REMOTE",
    githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com",
  },
  {
    id: 3,
    name: "Kunal Bansod",
    slug: "kunal-bansod",
    title: "Product Designer (UI/UX)",
    bio: "Creating clear, delightful interfaces for B2B SaaS and consumer mobile apps. 4+ years creating design systems in Figma and conducting user research.",
    location: "Nagpur",
    primarySkills: ["Figma", "Design Systems", "User Research", "Wireframing", "Interaction Design"],
    experienceYears: 4,
    openToWork: true,
    workPreference: "HYBRID",
    linkedinUrl: "https://linkedin.com",
    portfolioUrl: "https://kunal.design",
  },
  {
    id: 4,
    name: "Tanvi Raut",
    slug: "tanvi-raut",
    title: "Frontend Developer",
    bio: "Frontend engineer focused on accessible, responsive web applications with React, Next.js, and modern CSS animations.",
    location: "Nagpur",
    primarySkills: ["React", "JavaScript", "Next.js", "Tailwind CSS", "HTML5/CSS3"],
    experienceYears: 2,
    openToWork: true,
    workPreference: "ON_SITE",
    githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com",
  },
];

import {
  INDORE_SEED_COMPANIES,
  INDORE_SEED_FOUNDERS,
  INDORE_SEED_EVENTS,
  INDORE_SEED_JOBS,
} from "@/db/indore-seed-data";

export const INDORE_COMPANIES_DATA: CompanyData[] = INDORE_SEED_COMPANIES.map((c, idx) => ({
  id: 1000 + idx + 1,
  name: c.name,
  slug: c.slug,
  websiteUrl: c.websiteUrl,
  linkedinUrl: c.linkedinUrl ?? null,
  descriptionShort: c.descriptionShort,
  descriptionLong: c.descriptionLong,
  sector: c.sector,
  companyType: c.companyType as any,
  stage: c.stage as any,
  foundedYear: c.foundedYear,
  teamSize: c.teamSize,
  locationName: c.locationName,
  address: c.address,
  latitude: c.latitude,
  longitude: c.longitude,
  hiring: c.hiring,
  featured: c.featured ?? false,
  careersUrl: c.careersUrl ?? null,
  verificationStatus: c.verificationStatus as any,
  lastVerifiedAt: c.lastVerifiedAt,
  verificationSource: c.verificationSource,
  logoUrl: c.logoUrl ?? null,
  tags: c.tags,
}));

export const INDORE_FOUNDERS_DATA: FounderData[] = INDORE_SEED_FOUNDERS.map((f, idx) => {
  const company = INDORE_COMPANIES_DATA.find((c) => c.slug === f.companySlug);
  return {
    id: 1000 + idx + 1,
    name: f.name,
    slug: f.slug,
    role: f.role,
    companySlug: f.companySlug,
    companyName: company?.name || f.companySlug,
    bio: f.bio,
    linkedinUrl: f.linkedinUrl ?? null,
    location: f.location,
  };
});

export const INDORE_JOBS_DATA: JobData[] = INDORE_SEED_JOBS.map((j, idx) => {
  const company = INDORE_COMPANIES_DATA.find((c) => c.slug === j.companySlug);
  return {
    id: 1000 + idx + 1,
    title: j.title,
    slug: j.slug,
    companySlug: j.companySlug,
    companyName: company?.name || j.companySlug,
    companyLogo: company?.logoUrl ?? null,
    description: j.description,
    location: j.location,
    remoteType: j.remoteType,
    employmentType: j.employmentType,
    experienceMin: j.experienceMin,
    experienceMax: j.experienceMax,
    salaryMin: j.salaryMin,
    salaryMax: j.salaryMax,
    currency: j.currency,
    skills: j.skills,
    applicationUrl: j.applicationUrl,
    department: j.department,
    postedAt: j.postedAt,
    featured: j.featured ?? false,
  };
});

export const INDORE_EVENTS_DATA: EventData[] = INDORE_SEED_EVENTS.map((e, idx) => ({
  id: 1000 + idx + 1,
  title: e.title,
  slug: e.slug,
  description: e.description,
  eventType: e.eventType,
  organizer: e.organizer,
  date: e.date,
  startTime: e.startTime,
  endTime: e.endTime,
  venue: e.venue,
  location: e.location,
  registrationUrl: e.registrationUrl,
  price: e.price,
  imageUrl: e.imageUrl ?? null,
  status: e.status,
  featured: e.featured ?? false,
}));

// ─── Query Helper Functions ─────────────────────────────────────────────────

export function getAllCompanies(): CompanyData[] {
  return [...COMPANIES_DATA, ...INDORE_COMPANIES_DATA];
}

export function getCompanyBySlug(slug: string): CompanyData | undefined {
  return [...COMPANIES_DATA, ...INDORE_COMPANIES_DATA].find((c) => c.slug === slug);
}

export function getFeaturedCompanies(limit = 6): CompanyData[] {
  return [...COMPANIES_DATA, ...INDORE_COMPANIES_DATA].filter((c) => c.featured).slice(0, limit);
}

export function getHiringCompanies(): CompanyData[] {
  return [...COMPANIES_DATA, ...INDORE_COMPANIES_DATA].filter((c) => c.hiring);
}

export function getCompaniesBySector(sector: string): CompanyData[] {
  const norm = sector.toLowerCase().replace(/-/g, " ");
  return [...COMPANIES_DATA, ...INDORE_COMPANIES_DATA].filter(
    (c) => c.sector.toLowerCase() === norm ||
           c.sector.toLowerCase().replace(/-/g, " ") === norm ||
           c.tags.some((t) => t.toLowerCase() === norm || t.toLowerCase().replace(/-/g, " ") === norm)
  );
}

export function getCompaniesByArea(areaSlug: string): CompanyData[] {
  const norm = areaSlug.toLowerCase().replace(/-/g, " ");
  return [...COMPANIES_DATA, ...INDORE_COMPANIES_DATA].filter(
    (c) => c.locationName.toLowerCase().replace(/\s+/g, "-") === areaSlug.toLowerCase() ||
           c.locationName.toLowerCase().includes(norm)
  );
}

export function getAllJobs(): JobData[] {
  return [...JOBS_DATA, ...INDORE_JOBS_DATA];
}

export function getJobBySlug(slug: string): JobData | undefined {
  return [...JOBS_DATA, ...INDORE_JOBS_DATA].find((j) => j.slug === slug);
}

export function getJobsByCompany(companySlug: string): JobData[] {
  return [...JOBS_DATA, ...INDORE_JOBS_DATA].filter((j) => j.companySlug === companySlug);
}

export function getAllEvents(): EventData[] {
  return [...EVENTS_DATA, ...INDORE_EVENTS_DATA];
}

export function getEventBySlug(slug: string): EventData | undefined {
  return [...EVENTS_DATA, ...INDORE_EVENTS_DATA].find((e) => e.slug === slug);
}

export function getAllFounders(): FounderData[] {
  return [...FOUNDERS_DATA, ...INDORE_FOUNDERS_DATA];
}

export function getFounderBySlug(slug: string): FounderData | undefined {
  return [...FOUNDERS_DATA, ...INDORE_FOUNDERS_DATA].find((f) => f.slug === slug);
}

export function getFoundersByCompany(companySlug: string): FounderData[] {
  return [...FOUNDERS_DATA, ...INDORE_FOUNDERS_DATA].filter((f) => f.companySlug === companySlug);
}

export function getAllTalent(): TalentData[] {
  return TALENT_DATA;
}

export function getTalentBySlug(slug: string): TalentData | undefined {
  return TALENT_DATA.find((t) => t.slug === slug);
}

export function getStats() {
  return {
    totalCompanies: COMPANIES_DATA.length + INDORE_COMPANIES_DATA.length,
    totalJobs: JOBS_DATA.length + INDORE_JOBS_DATA.length,
    totalEvents: EVENTS_DATA.length + INDORE_EVENTS_DATA.length,
    totalFounders: FOUNDERS_DATA.length + INDORE_FOUNDERS_DATA.length,
    totalTalent: TALENT_DATA.length,
    hiringCompanies: [...COMPANIES_DATA, ...INDORE_COMPANIES_DATA].filter((c) => c.hiring).length,
  };
}

export function getCompaniesForCity(citySlug: string): CompanyData[] {
  if (citySlug.toLowerCase() === "indore") {
    return INDORE_COMPANIES_DATA;
  }
  return COMPANIES_DATA;
}

export function getJobsForCity(citySlug: string): JobData[] {
  if (citySlug.toLowerCase() === "indore") {
    return INDORE_JOBS_DATA;
  }
  return JOBS_DATA;
}

export function getEventsForCity(citySlug: string): EventData[] {
  if (citySlug.toLowerCase() === "indore") {
    return INDORE_EVENTS_DATA;
  }
  return EVENTS_DATA;
}

export function getFoundersForCity(citySlug: string): FounderData[] {
  if (citySlug.toLowerCase() === "indore") {
    return INDORE_FOUNDERS_DATA;
  }
  return FOUNDERS_DATA;
}

