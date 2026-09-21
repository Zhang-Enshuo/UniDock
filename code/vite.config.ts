import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import type { IncomingMessage, ServerResponse } from "node:http";

type MailAnalysisRequest = {
  mailText?: string;
  today?: string;
  timezone?: string;
};

type AiProvider = "glm" | "openai";
type ServerEnv = Record<string, string | undefined>;

const aiSuggestionSchema = {
  type: "object",
  additionalProperties: false,
  required: ["hasTasks", "suggestions"],
  properties: {
    hasTasks: { type: "boolean" },
    suggestions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "dueDate", "dueTime", "source", "type", "confidence", "evidence"],
        properties: {
          title: { type: "string" },
          dueDate: { type: ["string", "null"] },
          dueTime: { type: ["string", "null"] },
          source: { type: ["string", "null"] },
          type: { enum: ["assignment", "appointment", "meeting", "material", "admin", "other"] },
          confidence: { enum: ["low", "medium", "high"] },
          evidence: { type: ["string", "null"] },
        },
      },
    },
  },
};

const mailAnalysisSystemPrompt =
  "You extract todo suggestions for a student from pasted emails, announcements, or message content. Tasks may come from courses, teachers, classmates, clubs, accommodation, personal admin, or daily life. Return only tasks that are explicit or strongly implied. Use the user's local date context for relative dates. Do not invent deadlines. Return JSON only, matching this TypeScript shape: { hasTasks: boolean; suggestions: Array<{ title: string; dueDate: string | null; dueTime: string | null; source: string | null; type: 'assignment' | 'appointment' | 'meeting' | 'material' | 'admin' | 'other'; confidence: 'low' | 'medium' | 'high'; evidence: string | null; }> }.";

function aiProvider(env: ServerEnv): AiProvider {
  return env.AI_PROVIDER === "openai" ? "openai" : "glm";
}

function providerConfig(env: ServerEnv) {
  const provider = aiProvider(env);
  if (provider === "openai") {
    return {
      provider,
      apiKey: env.OPENAI_API_KEY,
      keyName: "OPENAI_API_KEY",
      model: env.OPENAI_MODEL || "gpt-4.1-mini",
    };
  }

  return {
    provider,
    apiKey: env.GLM_API_KEY,
    keyName: "GLM_API_KEY",
    model: env.GLM_MODEL || "glm-4.7-flash",
  };
}

function readRequestBody(req: IncomingMessage) {
  return new Promise<string>((resolve, reject) => {
    let body = "";
    req.on("data", (chunk: Buffer) => {
      body += chunk.toString("utf8");
      if (body.length > 120_000) {
        reject(new Error("邮件内容过长。"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function sendJson(res: ServerResponse, statusCode: number, value: unknown) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(value));
}

function extractOutputText(value: unknown) {
  if (!value || typeof value !== "object") return "";
  const payload = value as { output_text?: unknown; output?: Array<{ content?: Array<{ type?: string; text?: string }> }> };
  if (typeof payload.output_text === "string") return payload.output_text;
  return payload.output?.flatMap((item) => item.content ?? []).find((content) => content.type === "output_text")?.text ?? "";
}

function extractChatText(value: unknown) {
  if (!value || typeof value !== "object") return "";
  const payload = value as { choices?: Array<{ message?: { content?: unknown } }> };
  const content = payload.choices?.[0]?.message?.content;
  return typeof content === "string" ? content : "";
}

function parseJsonText(text: string) {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return JSON.parse(fenced?.[1] ?? trimmed);
}

async function callGlmMailAnalysis(config: ReturnType<typeof providerConfig>, body: MailAnalysisRequest, mailText: string) {
  const response = await fetch("https://api.z.ai/api/paas/v4/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: "system", content: mailAnalysisSystemPrompt },
        {
          role: "user",
          content: JSON.stringify({
            today: body.today,
            timezone: body.timezone,
            email: mailText,
          }),
        },
      ],
      temperature: 0.2,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    return { ok: false, status: response.status, payload: { error: "GLM 邮件分析服务请求失败。" } };
  }

  const outputText = extractChatText(await response.json());
  if (!outputText) {
    return { ok: false, status: 502, payload: { error: "GLM 返回格式无法识别。" } };
  }

  return { ok: true, status: 200, payload: parseJsonText(outputText) };
}

async function callOpenAiMailAnalysis(config: ReturnType<typeof providerConfig>, body: MailAnalysisRequest, mailText: string) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.model,
      input: [
        {
          role: "system",
          content: mailAnalysisSystemPrompt,
        },
        {
          role: "user",
          content: JSON.stringify({
            today: body.today,
            timezone: body.timezone,
            email: mailText,
          }),
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "mail_todo_analysis",
          strict: true,
          schema: aiSuggestionSchema,
        },
      },
    }),
  });

  if (!response.ok) {
    return { ok: false, status: response.status, payload: { error: "OpenAI 邮件分析服务请求失败。" } };
  }

  const outputText = extractOutputText(await response.json());
  if (!outputText) {
    return { ok: false, status: 502, payload: { error: "OpenAI 返回格式无法识别。" } };
  }

  return { ok: true, status: 200, payload: parseJsonText(outputText) };
}

async function analyzeMail(req: IncomingMessage, res: ServerResponse, env: ServerEnv) {
  const config = providerConfig(env);

  if (!config.apiKey) {
    sendJson(res, 503, { error: `本地 AI 分析代理当前使用 ${config.provider.toUpperCase()}，尚未配置 ${config.keyName}。` });
    return;
  }

  const body = JSON.parse(await readRequestBody(req)) as MailAnalysisRequest;
  const mailText = body.mailText?.trim();

  if (!mailText) {
    sendJson(res, 400, { error: "请先粘贴邮件内容。" });
    return;
  }

  const result =
    config.provider === "openai"
      ? await callOpenAiMailAnalysis(config, body, mailText)
      : await callGlmMailAnalysis(config, body, mailText);

  sendJson(res, result.status, result.payload);
}

export default defineConfig(({ mode }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd(), "") };

  return {
    plugins: [
      react(),
      {
        name: "unidock-ai-mail-analysis",
        configureServer(server) {
          server.middlewares.use("/api/ai/mail-analysis", async (req, res) => {
            if (req.method !== "POST") {
              sendJson(res, 405, { error: "Only POST is supported." });
              return;
            }

            try {
              await analyzeMail(req, res, env);
            } catch {
              sendJson(res, 500, { error: "AI 分析代理处理失败。" });
            }
          });
        },
      },
    ],
  };
});
