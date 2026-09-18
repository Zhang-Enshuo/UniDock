import type { UniLink } from "../types";

export const links: UniLink[] = [
  { id: "moodle", categoryId: "study", title: "Moodle", description: "课程资料、作业和学习内容入口。", url: "https://moodle.telt.unsw.edu.au/login/" },
  { id: "allocate", categoryId: "study", title: "Allocate+", description: "查看课表、选课和出勤相关信息。", url: "https://timetables.unswcollege.edu.au/aplus/student" },
  { id: "academic-calendar", categoryId: "study", title: "Academic Calendar", description: "查看关键日期、假期和学期安排。", url: "https://www.unswcollege.edu.au/study/key-dates" },
  { id: "subject-form", categoryId: "study", title: "Subject Enrolment Form", description: "提交选课或科目登记相关表格。", url: "https://self-enrolment-portal.unswcollege.edu.au/" },
  { id: "progress-support", categoryId: "study", title: "Student Progress Support", description: "预约学业进度支持。", url: "https://outlook.office365.com/book/StudentProgressBookHeretoMeetWithanAcademicAdviser@unswcollege.edu.au/" },
  { id: "current-student", categoryId: "admin", title: "Current Student Website", description: "查看 UNSW College 当前学生的重要信息与服务入口。", url: "https://my.unswcollege.edu.au/" },
  { id: "student-forms", categoryId: "admin", title: "Student Forms", description: "查找并提交学生事务表格。", url: "https://my.unswcollege.edu.au/forms/" },
  { id: "student-id", categoryId: "admin", title: "Student ID Card", description: "预约办理或更换学生卡。", url: "https://app.qtrac.com/scheduler-execution?c-id=0ec4181c-e500-47e0-98a5-690d783bfefb&s-id=486a1a5c-3ef3-4113-afb4-f2b05862523c&type=AB&b-id=e1bbea61-5b10-4405-a90e-4cd5644ac85a" },
  { id: "college-policies", categoryId: "admin", title: "College Policies", description: "查看学院政策和流程。", url: "https://www.unswcollege.edu.au/about/policies" },
  { id: "fs-preferences", categoryId: "admin", title: "FS UNSW Preferences", description: "Foundation Studies 升学偏好相关入口。", url: "https://uc-prd-jrplus-uni-preferences-webapp.azurewebsites.net/" },
  { id: "accommodation", categoryId: "support", title: "Accommodation Support", description: "预约住宿相关支持。", url: "https://my.unswcollege.edu.au/student-support/#book-appointment" },
  { id: "wellbeing", categoryId: "support", title: "Wellbeing Support", description: "预约身心健康支持。", url: "https://outlook.office365.com/book/BookYourAppointmentWithaStudentAdviser@unswcollege.edu.au/" },
  { id: "campus-support", categoryId: "support", title: "24/7 Support on Campus", description: "校园安全和紧急支持入口。", url: "https://www.unsw.edu.au/safezone" },
  { id: "contact-us", categoryId: "help", title: "Contact Us", description: "不知道找谁时，从这里提交问题。", url: "https://forms.office.com/Pages/ResponsePage.aspx?id=IJmLEFRmKkadPXk3tUnNb8tcajUoFPNGjHLoPtm6361UQkQwVkpWTlVYWFozUVk0NUpPN1g3VjJCTCQlQCN0PWcu" },
  { id: "important-contacts", categoryId: "help", title: "Important Student Contacts", description: "查看重要部门和支持联系方式。", url: "https://my.unswcollege.edu.au/student-support/important-student-contacts/" },
  { id: "campus-map", categoryId: "campus", title: "Campus Map", description: "查找教室和校园地点。", url: "https://my.unswcollege.edu.au/student-support/timetable-codes-and-locations/" },
  { id: "events", categoryId: "campus", title: "Events & Activities", description: "查看校园活动和社团活动。", url: "https://my.unswcollege.edu.au/events-and-activities/" },
  { id: "volunteering", categoryId: "campus", title: "Volunteering", description: "查看志愿活动机会。", url: "https://timecounts.app/unsw-college-volunteers" },
  { id: "password", categoryId: "account", title: "Forgot zID Password", description: "重置 zID 密码。", url: "https://iam.unsw.edu.au/home" },
  { id: "email", categoryId: "account", title: "Student Email", description: "查看学校邮件和正式通知。", url: "https://www.student.unsw.edu.au/emails" },
];
