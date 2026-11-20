export const salaryReviewedAt = "2026-11-20";

export const salarySources = {
  web: { publisher: "DOLE Careerinfo", period: "2020 career guide", url: "https://cip.philjobnet.gov.ph/wp-content/uploads/2021/07/Website-Developer.pdf" },
  software: { publisher: "DOLE Careerinfo", period: "General software career reference", url: "https://cip.philjobnet.gov.ph/?careers=software-developer&highlight=In-demand" },
  analyst: { publisher: "DOLE Careerinfo", period: "2022 career guide", url: "https://cip.philjobnet.gov.ph/wp-content/uploads/2023/03/Data-Analyst.pdf" },
  data: { publisher: "DOLE Careerinfo", period: "2022 career guide", url: "https://cip.philjobnet.gov.ph/wp-content/uploads/2023/03/Data-Engineer.pdf" },
  design: { publisher: "DOLE Careerinfo", period: "2022 career guide", url: "https://cip.philjobnet.gov.ph/wp-content/uploads/2023/03/User-Interface-DesignerUX-Designer-2.pdf" },
  electronics: { publisher: "DOLE Careerinfo", period: "2022 career guide", url: "https://cip.philjobnet.gov.ph/wp-content/uploads/2023/03/Micro-Electronics-Engineer.pdf" },
  network: { publisher: "Indeed", period: "2026 junior salary reference", url: "https://ph.indeed.com/career/junior-network-engineer/salaries" },
  security: { publisher: "Permhunt", period: "2026 Metro Manila guide", url: "https://permhunt.com/blog/2026-salary-guide-cybersecurity-professionals-philippines" },
  devops: { publisher: "Permhunt", period: "2026 Metro Manila guide", url: "https://permhunt.com/blog/2026-salary-guide-devops-engineers-philippines" },
};

type StartingSalary = {
  lowPhp: number;
  highPhp: number;
  role: string;
  source: keyof typeof salarySources;
  coverage: string;
};

const careerReferences: Readonly<Record<string, StartingSalary>> = {
  "cced74bd-db5a-51e2-9306-1209dd41dec7": {
    lowPhp: 30000, highPhp: 40000, role: "General software development", source: "software",
    coverage: "Broader software-role estimate for a first backend job; the source’s overall range includes experienced developers.",
  },
  "1c5a1b58-47c2-569c-9f18-77486cc9d829": {
    lowPhp: 30000, highPhp: 40000, role: "General software development", source: "software",
    coverage: "Broader software-role estimate for a first full-stack job; project scope and employer affect offers.",
  },
  "3556bbb7-ac30-5aec-ac42-46c277abf825": {
    lowPhp: 30000, highPhp: 40000, role: "General software development", source: "software",
    coverage: "Broader software-role estimate for mobile development; native and cross-platform jobs can differ.",
  },
  "c5259752-baf4-59ce-9682-596375a5cc7f": {
    lowPhp: 30000, highPhp: 40000, role: "General software development", source: "software",
    coverage: "Broader software-role estimate for game development, not a game-studio salary survey.",
  },
  "fe9ab18e-e5fe-5a27-9f57-8c92ec4613b2": {
    lowPhp: 40000, highPhp: 50000, role: "Entry-level data engineering / data work", source: "data",
    coverage: "Broader data-role estimate for early AI work; dedicated AI engineering jobs can have different requirements and pay.",
  },
  "c93df31e-9fe9-5ca2-95da-b7b6307d1ab8": {
    lowPhp: 35000, highPhp: 45000, role: "Entry-level data analysis", source: "analyst",
    coverage: "Broader analyst-role estimate for a first data-science position, not a specialist data-scientist average.",
  },
  "12a912b3-a9f2-5acc-b397-814a61a5ccfd": {
    lowPhp: 35000, highPhp: 45000, role: "Entry-level data analysis", source: "analyst",
    coverage: "Broader analyst-role estimate for BI reporting and dashboard work.",
  },
  "d5da6f7f-acfb-5fce-a703-3ee858526264": {
    lowPhp: 20000, highPhp: 35000, role: "Junior networking / infrastructure", source: "network",
    coverage: "Broader infrastructure estimate for entry cloud-support work; specialist cloud engineering can pay differently.",
  },
  "e46a121b-b0b8-5e62-bedd-ebd9303f2eca": {
    lowPhp: 20000, highPhp: 35000, role: "Junior networking / infrastructure", source: "network",
    coverage: "Broader infrastructure-role estimate for early systems administration.",
  },
  "e57a6553-a0b1-5512-ba66-4037c27886dc": {
    lowPhp: 20000, highPhp: 35000, role: "Graduate / junior cybersecurity", source: "security",
    coverage: "Broader security-role estimate for an entry support pathway; dedicated cloud security engineering often requires prior experience.",
  },
  "bc160707-e98f-5f72-b9dc-b77a5c02083e": {
    lowPhp: 20000, highPhp: 35000, role: "Junior networking / infrastructure", source: "network",
    coverage: "Broader infrastructure-role estimate for early Linux administration, not a specialist Linux engineering average.",
  },
  "79cfc498-d637-5dee-a28a-6544a3f9c5a0": {
    lowPhp: 30000, highPhp: 40000, role: "Website development", source: "web",
    coverage: "Broader web-development estimate; frontend offers vary by portfolio and employer.",
  },
  "0f8f854e-4b87-5c2c-9d99-5a557fe304de": {
    lowPhp: 35000, highPhp: 45000, role: "Entry-level Data Analyst", source: "analyst",
    coverage: "Rounded planning range around the guide’s entry-level reference; smaller employers may offer less.",
  },
  "a4e54446-2b44-5716-bd3e-5cebb6253d9b": {
    lowPhp: 40000, highPhp: 50000, role: "Entry-level Data Engineer", source: "data",
    coverage: "Rounded planning range around the guide’s entry-level reference.",
  },
  "467303dd-7d03-5c1a-bd44-3b5fdb996cc3": {
    lowPhp: 30000, highPhp: 40000, role: "Entry-level UI / UX Designer", source: "design",
    coverage: "Combined design-role estimate; UI and UX use the same broad starting range.",
  },
  "dbd9109d-1d9c-53e2-840f-b91c3f860dfe": {
    lowPhp: 30000, highPhp: 40000, role: "Entry-level UI / UX Designer", source: "design",
    coverage: "Combined design-role estimate; UI and UX use the same broad starting range.",
  },
  "88ac4df4-45e5-5f6f-9e9c-5f5b35db1aa9": {
    lowPhp: 40000, highPhp: 50000, role: "Data engineering / early-career data work", source: "data",
    coverage: "Broader data-role estimate for getting a first foothold in ML; dedicated ML jobs can pay differently.",
  },
  "505b7463-bb7b-5b0d-915d-1765aa364500": {
    lowPhp: 20000, highPhp: 35000, role: "Junior Network Engineer", source: "network",
    coverage: "Rounded estimate around junior networking pay; certifications, shifts and location affect offers.",
  },
  "5bd57e28-f4bd-5380-8d2f-6d8927d33b9b": {
    lowPhp: 20000, highPhp: 35000, role: "Graduate / junior cybersecurity", source: "security",
    coverage: "Broad starting estimate for analyst, monitoring and security-support work in Metro Manila.",
  },
  "f1756a96-98af-5abe-8439-423486b168d1": {
    lowPhp: 20000, highPhp: 35000, role: "Graduate / junior cybersecurity", source: "security",
    coverage: "Broader security-role estimate, not a dedicated penetration-testing average. Specialist offers can differ.",
  },
  "8cac2720-79c7-54d4-a2f4-2f0082568b12": {
    lowPhp: 25000, highPhp: 40000, role: "Entry-level Microelectronics Engineer", source: "electronics",
    coverage: "Broader electronics-design estimate for hardware work; industry and responsibilities vary.",
  },
  "3f53351f-851f-5aec-9ece-12f22220174f": {
    lowPhp: 25000, highPhp: 40000, role: "Entry-level electronics / hardware development", source: "electronics",
    coverage: "Broader electronics-role estimate for embedded work, not a dedicated firmware salary survey.",
  },
  "24068b09-7695-5744-88ca-9e678a40e06b": {
    lowPhp: 50000, highPhp: 85000, role: "Junior DevOps Engineer (1–3 years)", source: "devops",
    coverage: "Early-career Metro Manila estimate; DevOps often expects prior development or operations experience.",
  },
};

export function salaryForCareer(careerId: string): StartingSalary | undefined {
  return Object.hasOwn(careerReferences, careerId) ? careerReferences[careerId] : undefined;
}

export function formatMonthlySalary(amount: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency", currency: "PHP", maximumFractionDigits: 0,
  }).format(amount);
}
