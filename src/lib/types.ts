// Strict hierarchy: Organization -> Fest -> Event -> Registration

export type Category =
  | "Hackathon"
  | "Robotics"
  | "Quiz"
  | "Design"
  | "Workshop"
  | "Security"
  | "Startup"
  | "Gaming";

export type RegistrationStatus = "pending" | "confirmed";

export interface Organization {
  id: string;
  name: string;
  tagline: string;
  university: string;
  founded: number;
}

export interface Fest {
  id: string;
  orgId: string;
  name: string;
  tagline: string;
  description: string;
  startDate: string; // ISO
  endDate: string; // ISO
  location: string;
  accent: "cyan" | "purple";
  highlights: string[];
}

export interface ClubEvent {
  id: string;
  festId: string;
  title: string;
  category: Category;
  description: string;
  venue: string;
  date: string; // ISO date-time
  deadline: string; // ISO date-time
  capacity: number;
  prizePool?: string;
  teamSize: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  studentId: string;
  department: string;
  phone: string;
}

export interface Registration {
  id: string;
  ticketId: string;
  eventId: string;
  userId: string;
  status: RegistrationStatus;
  createdAt: string; // ISO
}

export interface Database {
  organization: Organization;
  fests: Fest[];
  events: ClubEvent[];
  users: User[];
  registrations: Registration[];
}
