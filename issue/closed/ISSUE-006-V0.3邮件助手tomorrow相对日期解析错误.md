# V0.3 邮件助手 tomorrow 相对日期解析错误

## 基本信息

- 编号：ISSUE-006
- 类型：bug
- 优先级：高 / P0
- 当前状态：已完成

## 背景说明

V0.3 规划要求邮件分析助手能够从手动粘贴的邮件中提取截止日期和截止时间，并生成可编辑 Todo 建议。产品部在 `http://127.0.0.1:5173/` 验收时发现，相对日期 `tomorrow` 解析错误。

复现步骤：

1. 打开 Home 页 Todo 面板。
2. 点击“从邮件生成”。
3. 粘贴邮件内容：

```text
Computing Lab meeting tomorrow at 10:00. Please prepare material and submit the worksheet.
```

4. 点击“分析邮件”。
5. 查看生成的 Todo 建议。

实际结果：

页面顶部显示当前日期为 `Sunday 20 Sept`，浏览器本地日期也确认为 `Sun Sep 20 2026 15:13:40 GMT+0800`。

但邮件建议的截止日期生成的是：

```text
2026-09-20
```

这与 `tomorrow` 语义不符。

期望结果：

在当前日期为 2026-09-20 时，邮件中的 `tomorrow` 应解析为：

```text
2026-09-21
```

技术观察：

问题疑似来自 `code/src/components/TodoPanel.tsx` 中 `addDays` 使用：

```ts
return value.toISOString().slice(0, 10);
```

在 GMT+8 等时区下，本地日期转 ISO UTC 后会回退一天，导致 `tomorrow` 算出的日期仍显示为当天。该问题也可能影响 Todo 的“明天”状态标签。

影响范围：

- 邮件助手相对日期解析。
- Todo “明天”标签判断。
- 可能影响任何依赖 `addDays` 的日期逻辑。

## 建议处理方式

- 修正 `addDays` 或相关日期格式化逻辑，避免使用会受 UTC 转换影响的 `toISOString().slice(0, 10)` 作为本地日期字符串。
- 使用本地时区安全的 `YYYY-MM-DD` 生成方式，确保 Asia/Shanghai / GMT+8 环境下 today / tomorrow 语义正确。
- 同步核对 Todo “明天”标签判断，避免 dueDate 为 2026-09-21 时仍显示为今天或其他错误状态。
- 修复后执行构建检查。

建议验收标准：

- 在 Asia/Shanghai / GMT+8 环境中，当前日期为 2026-09-20 时：
  - `today` 解析为 2026-09-20。
  - `tomorrow` 解析为 2026-09-21。
- Todo dueDate 为 2026-09-21 时，应显示“明天 HH:00”。
- 邮件助手生成 tomorrow 建议后，建议卡片的截止日期为 2026-09-21。
- `npm run build` 通过。

## 关联内容

- 关联 spec：
- 关联代码：`code/src/components/TodoPanel.tsx`
- 关联里程碑：

## 处理记录

- 2026-09-20：产品部提交 V0.3 验收 P0 阻塞问题，issue 管理员登记为待处理 issue。
- 2026-09-20：产品部完成复验并确认通过。当前页面日期为 Sunday 20 Sept，邮件内容包含 `tomorrow at 10:00` 时，分析后 Todo 建议截止日期已正确生成为 `2026-09-21`；添加建议后切换到“计划”视图，Todo 显示为“明天 10:00”；`npm run build` 通过。ISSUE-006 关闭。
