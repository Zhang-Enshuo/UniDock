export type PageId =
  | "home"
  | "study"
  | "admin"
  | "support"
  | "help"
  | "campus"
  | "account";

export type LinkPageId = Exclude<PageId, "home">;
export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export type NavItem = {
  id: PageId;
  label: string;
  subtitle: string;
};

export type Course = {
  id: string;
  name: string;
  weekday: Weekday;
  startTime: string;
  endTime: string;
  location: string;
};

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

export type UniLink = {
  id: string;
  categoryId: LinkPageId;
  title: string;
  description: string;
  url: string;
};

export type CourseModalState = {
  course: Course;
  originRect: DOMRect;
} | null;
