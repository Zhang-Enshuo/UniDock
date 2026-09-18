import type { Course } from "../types";

export const courses: Course[] = [
  { id: "academic-english", name: "Academic English", weekday: "mon", startTime: "09:00", endTime: "10:30", location: "Mathews 310" },
  { id: "foundation-math", name: "Foundation Mathematics", weekday: "mon", startTime: "13:00", endTime: "15:00", location: "Science Theatre" },
  { id: "business-studies", name: "Business Studies", weekday: "tue", startTime: "11:00", endTime: "12:30", location: "Blockhouse G6" },
  { id: "computing-lab", name: "Computing Lab", weekday: "wed", startTime: "10:00", endTime: "12:00", location: "K17 Lab 203" },
  { id: "study-skills", name: "Study Skills Workshop", weekday: "thu", startTime: "14:00", endTime: "15:30", location: "Library Room 201" },
  { id: "progress-consultation", name: "Progress Consultation", weekday: "fri", startTime: "09:30", endTime: "10:00", location: "Student Hub" },
];
