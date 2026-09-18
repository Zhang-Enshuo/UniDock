# 修正 MVP 学校入口 Links 的真实 URL

## 基本信息

- 编号：ISSUE-001
- 类型：bug
- 优先级：高
- 当前状态：已完成

## 背景说明

产品部在 MVP 验收中确认，研发部实现的 UniDock MVP 首页基础版本在功能体验上符合产品目标：Home 页、导航分栏页、课表、待办事项主流程均通过产品验收。

但产品部在验收 Links 数据时发现，当前 `code/src/data/links.ts` 中不少链接使用了 UNSW 通用页面或 `https://www.unswcollege.edu.au/` 占位，而不是最初 Useful Links 中提供的真实直达入口。这会影响 UniDock MVP 的核心价值：减少新生查找成本、直达正确页面。

当前需要重点核对并修正以下入口 URL：

- Academic Calendar 应使用 UNSW College key dates。
- Subject Enrolment Form 应使用 self-enrolment portal。
- Student Progress Support 应使用 Outlook booking 链接。
- Student Forms 应使用 my.unswcollege forms。
- Student ID Card 应使用 Qtrac appointment 链接。
- College Policies 应使用 UNSW College policies 页面。
- FS UNSW Preferences 应使用 Azure preferences webapp。
- Accommodation Support 应使用 my.unswcollege accommodation support / appointment 入口。
- Wellbeing Support 应使用 UNSW College wellbeing booking 链接。
- 24/7 Support on Campus 应使用 SafeZone 页面。
- Contact Us 应使用原始 Microsoft Forms 联系入口。
- Important Student Contacts 应使用 my.unswcollege important contacts。
- Campus Map 应使用 my.unswcollege timetable codes and locations 页面。
- Events & Activities 应使用 my.unswcollege events and activities。
- Volunteering 应使用 Timecounts UNSW College volunteers。
- Student Email 应使用原始 student email 入口。

Moodle、Allocate+、Forgot zID Password 当前看起来接近原始入口，也建议一并核对。

## 建议处理方式

- 对照产品部最初提供的 Useful Links 原始清单，逐项核对 `code/src/data/links.ts` 中的学校入口 URL。
- 将每个入口 URL 恢复为产品部提供的真实直达地址，除非产品部另行确认使用替代地址。
- 保持当前 MVP spec 中的导航分组、链接名称和说明结构，不扩大为额外信息架构调整。
- 修正后由研发部执行构建检查。
- 产品部复验时逐项点击入口，确认能够直达对应学校页面，而不是落到泛首页或无关页面。

## 关联内容

- 关联 spec：`规划文档/spec文档/MVP-首页.md`
- 关联 UI spec：`规划文档/spec文档/UI-MVP-首页设计.md`
- 关联代码：`code/src/data/links.ts`
- 关联里程碑：`规划文档/里程碑文档/MVP-首页研发交付记录.md`

## 处理记录

- 2026-09-18：产品部提交 MVP 验收 P0 问题，issue 管理员登记为待处理 issue，等待研发部修正。
- 2026-09-18：研发部已按 Useful Links 原始清单修正 `code/src/data/links.ts` 中现有 MVP 入口 URL，并准备交产品部复验。
- 2026-09-18：产品部完成复验并确认通过。当前 MVP 中 19 个学校入口 URL 均已回到 Useful Links 原始直达地址；本地页面抽检渲染 href 未发现旧 UNSW 通用页面或 `https://www.unswcollege.edu.au/` 占位链接残留；`npm run build` 通过；入口分组、链接名称和说明结构保持 MVP spec。ISSUE-001 关闭。
