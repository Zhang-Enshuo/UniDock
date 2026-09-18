export type PageId =
  | "home"
  | "study"
  | "admin"
  | "support"
  | "help"
  | "campus"
  | "account"
  | "settings";

export type LinkPageId = Exclude<PageId, "home" | "settings">;
export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export type NavItem = {
  id: PageId;
  label: string;
  subtitle: string;
};

export type AgendaEvent = {
  id: string;
  name: string;
  weekday: Weekday;
  startTime: string;
  endTime: string;
  location: string;
};

export type Course = AgendaEvent;

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  dueTime?: string;
};

export type UniLink = {
  id: string;
  categoryId: LinkPageId;
  title: string;
  description: string;
  url: string;
};

export type CourseModalState = {
  course: AgendaEvent;
  originRect: DOMRect;
} | null;

export type AgendaEventModalState = {
  event: AgendaEvent;
  originRect: DOMRect;
} | null;

export type Profile = {
  displayName: string;
  zId: string;
  program: string;
  intake: string;
  studentEmail: string;
  campus: string;
  notes: string;
};
