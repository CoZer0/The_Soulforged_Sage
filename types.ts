
export enum PersonaType {
  DREAM_WEAVER = "The Dream Weaver",
  STILLWANDERER = "The Stillwanderer",
  GLYPHSMITH = "The Glyphsmith",
  FRAME_WEAVER = "The Frame Weaver",
  ABYSS = "The Abyss That Remembers"
}

export interface PersonaWork {
  title: string;
  category: string;
  image?: string;
  video?: string; // New: For Frame Weaver or other video works
  description: string;
  hidden?: boolean;
  dateAdded?: string; // For Latest Updates feed
}

// For Dream Weaver's collapsible sections
export interface ProjectItem {
  title: string;
  description: string;
  image: string;
  hidden?: boolean;
  dateAdded?: string;
}

export interface ProjectCategory {
  title: string;
  bannerImage: string;
  description: string;
  items: ProjectItem[];
  hidden?: boolean;
}

// For Abyss Writings
export interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
  replies?: Comment[]; // Nested replies
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  date: string;
  comments?: Comment[]; // New: Chapter-specific comments
}

export interface PersonaWriting {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  chapters: Chapter[]; 
  tags: string[];
  comments?: Comment[]; // Deprecated but kept for legacy migration
  hidden?: boolean;
}

export interface AbyssWhisper {
  id: string;
  content: string;
  date: string; // Includes time
  hidden?: boolean;
}

export interface PersonaContent {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  skills: string[];
  quote: string;
  details?: string[];
  hidden?: boolean;
  
  // Standard Gallery (Glyphsmith, Frame Weaver, Stillwanderer)
  works?: PersonaWork[];
  
  // Dream Weaver Specific
  projectCategories?: ProjectCategory[];

  // Abyss Specific
  writings?: PersonaWriting[];
  whispers?: AbyssWhisper[];
}

export enum AboutTab {
  PROFESSIONAL = "Professional",
  ROTARACT = "Rotaract",
  PERSONAL = "Personal"
}

export interface RoleItem {
  title: string;
  organization: string; // Club Name
  period: string;       // Year
}

// New: Year-wise timeline
export interface TimelineItem {
  id: string;
  year: string; // Format: 2021-22
  title: string;
  description: string;
}

// New: Dynamic Card with Icon
export interface CardItem {
  id: string;
  title: string;
  description?: string;
  icon: string; // Key for the icon mapper
}

// New: Professional Experience
export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

// New: Education
export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  period: string;
  description?: string;
}

// New: Software/Tools Known
export interface SoftwareItem {
  id: string;
  name: string;
  icon: string; // Key for icon mapper
}

export interface AboutContent {
  title: string;
  content: string[];
  highlights: string[]; // Simple string tags
  cards?: CardItem[];   // Rich tiles with icons
  roles?: RoleItem[];    // Structured roles for Rotaract
  timeline?: TimelineItem[]; // Year-wise journey for Rotaract
  experience?: ExperienceItem[]; // Professional Experience list
  education?: EducationItem[]; // Professional Education list
  software?: SoftwareItem[]; // List of tools/softwares
  logoUrl?: string;      // Specific logo for the page (e.g., Club Logo)
}

export interface SocialLink {
  platform: string; // 'LinkedIn', 'GitHub', 'Behance', 'Instagram'
  url: string;
}

export interface ContactDetails {
  email: string;
  phone: string;
  whatsapp?: string; // New WhatsApp number field
  location: string;
  socials: SocialLink[];
}

export interface AboutPageCard {
  title: string; // Fixed title usually, but can be edited if needed
  description: string;
}

export interface Announcement {
  enabled: boolean;
  text: string;
  link?: string;
}

export interface GlobalContent {
  logoUrl: string;
  siteTitle: string;
  contactInfo: ContactDetails;
  aboutPage: {
    professional: AboutPageCard;
    rotaract: AboutPageCard;
    personal: AboutPageCard;
  };
  announcement?: Announcement;
}

export enum UserRole {
  ADMIN = 'ADMIN', // Full access (Sage)
  EDITOR = 'EDITOR', // Content only
  GUEST = 'GUEST',
  SHOWOFF = 'SHOWOFF' // Secret Access
}

export interface User {
  username: string;
  role: UserRole;
}

export interface DataContextType {
  personas: Record<PersonaType, PersonaContent>;
  updatePersona: (type: PersonaType, data: PersonaContent) => void;
  globalContent: GlobalContent;
  updateGlobalContent: (data: GlobalContent) => void;
  aboutData: Record<AboutTab, AboutContent>;
  updateAboutData: (tab: AboutTab, data: AboutContent) => void;
  user: User | null; // Replaces isAdmin
  login: (username: string, password: string) => boolean;
  logout: () => void;
  hasPermission: (role: UserRole) => boolean;
}
