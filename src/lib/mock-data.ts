import type { ClubEvent, Database, Fest, Organization, Registration, User } from "./types";

/**
 * Rich, realistic seed database. Dates are generated relative to "today"
 * (day precision) so the demo always looks live for judges, no matter when
 * it is opened: deadlines stay in the future and trends end today.
 */

const DAY = 24 * 60 * 60 * 1000;

function startOfToday(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function daysFromNow(days: number, hour = 10, minute = 0): string {
  const t = new Date(startOfToday() + days * DAY);
  t.setHours(hour, minute, 0, 0);
  return t.toISOString();
}

export const organization: Organization = {
  id: "org-scpsc-cyber-hub",
  name: "SCPSC CYBER HUB",
  tagline: "South Point School & College Cyber & Tech Society",
  university: "SCPSC Campus",
  founded: 2018,
};

export const fests: Fest[] = [
  {
    id: "tech-carnival-2026",
    orgId: organization.id,
    name: "Tech Carnival 2026",
    tagline: "Annual Interschool & College Cyber Festival",
    description:
      "Competitive hackathons, robotics, speed programming, and cyber security challenges.",
    startDate: daysFromNow(18, 9),
    endDate: daysFromNow(20, 22),
    location: "SCPSC Main Campus · Auditorium & Tech Labs",
    accent: "cyan",
    highlights: ["৳3,00,000 Prizes", "Certified Badges", "1,200+ Participants"],
  },
  {
    id: "winter-innovation-summit",
    orgId: organization.id,
    name: "Winter Innovation Summit",
    tagline: "Frontier Tech, AI & Project Showcase",
    description:
      "Hands-on AI workshops, capture-the-flag competitions, and project showcases.",
    startDate: daysFromNow(62, 9),
    endDate: daysFromNow(64, 21),
    location: "SCPSC Tech Block · Innovation Wing",
    accent: "purple",
    highlights: ["AI Workshops", "CTF Challenges", "Project Showcase"],
  },
];

export const events: ClubEvent[] = [
  // ── Tech Carnival 2026 ──────────────────────────────────────────────
  {
    id: "tc-hackathon",
    festId: "tech-carnival-2026",
    title: "NeonHack 48",
    category: "Hackathon",
    description:
      "A 48-hour build marathon. Ship a working product around the theme 'Cities of 2050' and pitch it to industry judges.",
    venue: "Innovation Complex · Level 3",
    date: daysFromNow(18, 9),
    deadline: daysFromNow(12, 23, 59),
    capacity: 120,
    prizePool: "৳2,00,000",
    teamSize: "2–4 members",
  },
  {
    id: "tc-robotics",
    festId: "tech-carnival-2026",
    title: "RoboRumble Arena",
    category: "Robotics",
    description:
      "Autonomous and RC bots battle through obstacle mazes and sumo rings. Bring your own bot, we bring the arena.",
    venue: "Engineering Quad · Arena Pit",
    date: daysFromNow(19, 11),
    deadline: daysFromNow(10, 23, 59),
    capacity: 40,
    prizePool: "৳1,00,000",
    teamSize: "1–5 members",
  },
  {
    id: "tc-quiz",
    festId: "tech-carnival-2026",
    title: "ByteBlitz Tech Quiz",
    category: "Quiz",
    description:
      "Six rounds of rapid-fire questions on computing history, AI, space tech and internet culture. Buzzers ready.",
    venue: "Auditorium A",
    date: daysFromNow(18, 15),
    deadline: daysFromNow(15, 18),
    capacity: 60,
    prizePool: "৳40,000",
    teamSize: "Teams of 2",
  },
  {
    id: "tc-uiux",
    festId: "tech-carnival-2026",
    title: "PixelForge UI/UX Sprint",
    category: "Design",
    description:
      "Redesign a real-world civic app in six hours. Judged on research, usability, visual polish and prototype fidelity.",
    venue: "Design Lab 204",
    date: daysFromNow(19, 10),
    deadline: daysFromNow(14, 23, 59),
    capacity: 30,
    prizePool: "৳60,000",
    teamSize: "Solo or duo",
  },
  {
    id: "tc-gaming",
    festId: "tech-carnival-2026",
    title: "Valor Cup Esports",
    category: "Gaming",
    description:
      "5v5 tactical shooter tournament with live casting on the main stage screen. Double elimination bracket.",
    venue: "Student Center · Main Stage",
    date: daysFromNow(20, 13),
    deadline: daysFromNow(16, 20),
    capacity: 16,
    prizePool: "৳50,000",
    teamSize: "5 + 1 sub",
  },

  // ── Winter Innovation Summit ────────────────────────────────────────
  {
    id: "wis-ai-workshop",
    festId: "winter-innovation-summit",
    title: "Build-an-Agent AI Lab",
    category: "Workshop",
    description:
      "Hands-on workshop: build, evaluate and deploy an LLM-powered agent with tool use. Laptops required.",
    venue: "Hall B · Lab Pods",
    date: daysFromNow(62, 10),
    deadline: daysFromNow(55, 23, 59),
    capacity: 50,
    teamSize: "Individual",
  },
  {
    id: "wis-ctf",
    festId: "winter-innovation-summit",
    title: "FrostByte CTF",
    category: "Security",
    description:
      "Jeopardy-style capture-the-flag: web exploitation, reverse engineering, crypto and forensics challenges.",
    venue: "Hall B · Cyber Range",
    date: daysFromNow(63, 9),
    deadline: daysFromNow(56, 23, 59),
    capacity: 80,
    prizePool: "৳1,20,000",
    teamSize: "1–3 members",
  },
  {
    id: "wis-pitch",
    festId: "winter-innovation-summit",
    title: "Ignite Startup Pitch",
    category: "Startup",
    description:
      "Five minutes, one stage, a panel of angel investors. The best early-stage idea wins seed funding and mentorship.",
    venue: "Convention Center · Keynote Hall",
    date: daysFromNow(64, 14),
    deadline: daysFromNow(50, 23, 59),
    capacity: 24,
    prizePool: "৳3,00,000 seed",
    teamSize: "1–4 founders",
  },
  {
    id: "wis-quiz",
    festId: "winter-innovation-summit",
    title: "Polar Mind Quiz Bowl",
    category: "Quiz",
    description:
      "A head-to-head knowledge battle on science, startups and the frontier tech shaping the next decade.",
    venue: "Hall B · Stage 2",
    date: daysFromNow(63, 16),
    deadline: daysFromNow(58, 18),
    capacity: 40,
    prizePool: "৳30,000",
    teamSize: "Teams of 3",
  },
  {
    id: "wis-robotics",
    festId: "winter-innovation-summit",
    title: "Drone Dash Challenge",
    category: "Robotics",
    description:
      "Program a micro-drone to navigate an indoor course autonomously. Fastest clean run takes the crown.",
    venue: "Convention Center · Atrium",
    date: daysFromNow(64, 10),
    deadline: daysFromNow(57, 23, 59),
    capacity: 20,
    prizePool: "৳70,000",
    teamSize: "2–3 members",
  },
];

export const users: User[] = [
  { id: "u01", name: "Ayesha Rahman", email: "ayesha.rahman@mit.edu", studentId: "2021-1-60-014", department: "CSE", phone: "+880 1711-203914" },
  { id: "u02", name: "Tanvir Hossain", email: "tanvir.h@mit.edu", studentId: "2020-2-50-102", department: "EEE", phone: "+880 1819-445120" },
  { id: "u03", name: "Nusrat Jahan", email: "nusrat.jahan@mit.edu", studentId: "2022-1-60-221", department: "CSE", phone: "+880 1552-118374" },
  { id: "u04", name: "Rafiul Islam", email: "rafiul.islam@mit.edu", studentId: "2021-3-40-077", department: "ME", phone: "+880 1677-902231" },
  { id: "u05", name: "Sadia Afrin", email: "sadia.afrin@mit.edu", studentId: "2023-1-60-009", department: "CSE", phone: "+880 1915-664010" },
  { id: "u06", name: "Mehedi Hasan", email: "mehedi.hasan@mit.edu", studentId: "2020-1-60-188", department: "CSE", phone: "+880 1733-550982" },
  { id: "u07", name: "Farzana Akter", email: "farzana.akter@mit.edu", studentId: "2022-2-55-045", department: "BBA", phone: "+880 1611-339807" },
  { id: "u08", name: "Imran Chowdhury", email: "imran.c@mit.edu", studentId: "2021-2-50-133", department: "EEE", phone: "+880 1866-120455" },
  { id: "u09", name: "Lamia Karim", email: "lamia.karim@mit.edu", studentId: "2023-2-70-061", department: "Architecture", phone: "+880 1798-007612" },
  { id: "u10", name: "Arif Mahmud", email: "arif.mahmud@mit.edu", studentId: "2020-3-60-201", department: "CSE", phone: "+880 1922-781340" },
  { id: "u11", name: "Tasnim Ferdous", email: "tasnim.f@mit.edu", studentId: "2022-1-60-302", department: "CSE", phone: "+880 1559-443218" },
  { id: "u12", name: "Shakib Ahmed", email: "shakib.ahmed@mit.edu", studentId: "2021-1-40-090", department: "ME", phone: "+880 1745-226019" },
  { id: "u13", name: "Maliha Sultana", email: "maliha.s@mit.edu", studentId: "2023-1-55-118", department: "BBA", phone: "+880 1630-918274" },
  { id: "u14", name: "Zubair Alam", email: "zubair.alam@mit.edu", studentId: "2020-2-60-055", department: "CSE", phone: "+880 1877-310652" },
  { id: "u15", name: "Rumana Haque", email: "rumana.haque@mit.edu", studentId: "2022-3-50-019", department: "EEE", phone: "+880 1956-207813" },
  { id: "u16", name: "Nafis Iqbal", email: "nafis.iqbal@mit.edu", studentId: "2021-2-60-240", department: "CSE", phone: "+880 1712-884306" },
  { id: "u17", name: "Priya Das", email: "priya.das@mit.edu", studentId: "2023-2-60-077", department: "CSE", phone: "+880 1820-561947" },
  { id: "u18", name: "Kamrul Hasan", email: "kamrul.hasan@mit.edu", studentId: "2020-1-70-031", department: "Architecture", phone: "+880 1689-470128" },
];

// [eventId, userId, status, daysAgo, hour]
const regSeed: [string, string, "pending" | "confirmed", number, number][] = [
  ["tc-hackathon", "u01", "confirmed", 13, 10],
  ["tc-hackathon", "u06", "confirmed", 13, 14],
  ["tc-hackathon", "u10", "confirmed", 12, 9],
  ["tc-hackathon", "u14", "pending", 11, 20],
  ["tc-hackathon", "u16", "confirmed", 9, 11],
  ["tc-hackathon", "u03", "confirmed", 7, 16],
  ["tc-hackathon", "u17", "pending", 2, 13],
  ["tc-robotics", "u04", "confirmed", 12, 15],
  ["tc-robotics", "u12", "confirmed", 10, 12],
  ["tc-robotics", "u02", "pending", 6, 18],
  ["tc-robotics", "u08", "confirmed", 4, 10],
  ["tc-quiz", "u05", "confirmed", 11, 9],
  ["tc-quiz", "u11", "confirmed", 8, 19],
  ["tc-quiz", "u13", "pending", 5, 21],
  ["tc-quiz", "u07", "confirmed", 3, 11],
  ["tc-uiux", "u09", "confirmed", 10, 17],
  ["tc-uiux", "u18", "pending", 6, 12],
  ["tc-uiux", "u03", "confirmed", 4, 15],
  ["tc-gaming", "u14", "confirmed", 9, 22],
  ["tc-gaming", "u10", "confirmed", 7, 20],
  ["tc-gaming", "u16", "pending", 1, 21],
  ["wis-ai-workshop", "u01", "confirmed", 8, 10],
  ["wis-ai-workshop", "u05", "pending", 5, 14],
  ["wis-ai-workshop", "u11", "confirmed", 3, 9],
  ["wis-ai-workshop", "u17", "confirmed", 1, 17],
  ["wis-ctf", "u06", "confirmed", 7, 23],
  ["wis-ctf", "u15", "pending", 4, 13],
  ["wis-ctf", "u02", "confirmed", 2, 16],
  ["wis-pitch", "u07", "confirmed", 6, 11],
  ["wis-pitch", "u13", "pending", 2, 10],
  ["wis-quiz", "u08", "confirmed", 3, 19],
  ["wis-quiz", "u15", "confirmed", 1, 12],
  ["wis-robotics", "u12", "pending", 2, 15],
  ["wis-robotics", "u04", "confirmed", 0, 11],
];

export const registrations: Registration[] = regSeed.map(([eventId, userId, status, ago, hour], i) => ({
  id: `reg-${String(i + 1).padStart(3, "0")}`,
  ticketId: `SC-${eventId.split("-")[0].toUpperCase()}-${(4096 + i * 37).toString(16).toUpperCase()}`,
  eventId,
  userId,
  status,
  createdAt: daysFromNow(-ago, hour),
}));

export function createSeedDatabase(): Database {
  return {
    organization,
    fests: structuredClone(fests),
    events: structuredClone(events),
    users: structuredClone(users),
    registrations: structuredClone(registrations),
  };
}
