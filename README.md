# UniDock

本项目使用 AI / Codex 协作开发。

当前状态：通用开发前置已初始化，尚未进入具体需求讨论、技术选型或代码开发。

## 目录说明

- `规划文档/`：保存长期规划资料，包括 spec、产品迭代、技术验证和里程碑文档。
- `issue/`：参考 GitHub issue 的方式管理 bug、功能、优化、讨论和暂缓事项。
- `code/`：保存实际项目代码。

## 会话分工

- 产品部：明确项目目标、用户场景、MVP 范围和后续版本规划。
- UI部：设计页面结构、用户流程、组件布局、视觉风格和交互细节。
- 研发部：根据已确认的规划文档，在 `code/` 目录中实现项目。
- issue管理：管理 bug、待办、优化建议、遗留问题和下一步计划。

推荐协作顺序：产品部 -> UI部 -> 研发部 -> issue管理 -> 下一轮迭代。

## V0.4 AI 邮件分析配置

V0.4 前端不会保存邮件原文历史，也不会把 AI API key 写入浏览器代码。邮件分析通过本地或后端代理完成：

- 默认接口：`/api/ai/mail-analysis`
- 可选配置：在前端运行环境中设置 `VITE_AI_MAIL_ANALYSIS_ENDPOINT`
- 默认 AI provider：`glm`
- 默认模型：`glm-4.7-flash`

本地开发推荐在 `code/.env.local` 中配置，示例见 `code/.env.example`：

```bash
AI_PROVIDER=glm
GLM_API_KEY=your_glm_api_key
GLM_MODEL=glm-4.7-flash
```

如需临时切换到 OpenAI 备用方案：

```bash
AI_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4.1-mini
```

前端会向代理发送：

```json
{
  "mailText": "用户手动粘贴的邮件内容",
  "today": "2026-09-20",
  "timezone": "Asia/Shanghai"
}
```

代理应返回：

```json
{
  "hasTasks": true,
  "suggestions": [
    {
      "title": "准备 Computing Lab 所需材料",
      "dueDate": "2026-09-21",
      "dueTime": "10:00",
      "source": "Computing Lab",
      "type": "material",
      "confidence": "high",
      "evidence": "Please prepare material..."
    }
  ]
}
```

如果没有配置当前 provider 对应的 key，页面会显示分析失败和重试入口。默认情况下会提示缺少 `GLM_API_KEY`；这是为了避免在纯前端 Demo 中暴露密钥。
