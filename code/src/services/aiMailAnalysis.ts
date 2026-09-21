import type { AiConfidence, AiMailAnalysisResult, AiTodoSuggestion, AiTodoType } from "../types";

type ImportMetaWithEnv = ImportMeta & {
  env?: Record<string, string | undefined>;
};

const DEFAULT_AI_MAIL_ENDPOINT = "/api/ai/mail-analysis";
const requestTimeoutMs = 30000;
const allowedTypes: AiTodoType[] = ["assignment", "appointment", "meeting", "material", "admin", "other"];
const allowedConfidence: AiConfidence[] = ["low", "medium", "high"];

function aiMailEndpoint() {
  return ((import.meta as ImportMetaWithEnv).env?.VITE_AI_MAIL_ANALYSIS_ENDPOINT || DEFAULT_AI_MAIL_ENDPOINT).trim();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function optionalType(value: unknown) {
  return typeof value === "string" && allowedTypes.includes(value as AiTodoType) ? (value as AiTodoType) : undefined;
}

function optionalConfidence(value: unknown) {
  return typeof value === "string" && allowedConfidence.includes(value as AiConfidence) ? (value as AiConfidence) : undefined;
}

function normalizeSuggestion(value: unknown): AiTodoSuggestion | null {
  if (!isRecord(value)) return null;
  const title = optionalString(value.title);
  if (!title) return null;

  return {
    title,
    dueDate: optionalString(value.dueDate),
    dueTime: optionalString(value.dueTime),
    source: optionalString(value.source),
    type: optionalType(value.type),
    confidence: optionalConfidence(value.confidence),
    evidence: optionalString(value.evidence),
  };
}

function normalizeResult(value: unknown): AiMailAnalysisResult {
  if (!isRecord(value) || typeof value.hasTasks !== "boolean" || !Array.isArray(value.suggestions)) {
    throw new Error("AI 返回格式无法识别。");
  }

  const suggestions = value.suggestions.map(normalizeSuggestion).filter((suggestion): suggestion is AiTodoSuggestion => Boolean(suggestion));
  return {
    hasTasks: value.hasTasks && suggestions.length > 0,
    suggestions,
  };
}

export async function analyzeMailWithAi(mailText: string, context: { today: string; timezone: string }): Promise<AiMailAnalysisResult> {
  const endpoint = aiMailEndpoint();
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mailText, today: context.today, timezone: context.timezone }),
      signal: controller.signal,
    });

    const payload = await response.json();
    if (!response.ok) {
      if (isRecord(payload) && typeof payload.error === "string") {
        throw new Error(payload.error);
      }
      if (response.status === 404) {
        throw new Error("本地 AI 分析代理尚未配置。");
      }
      throw new Error(`AI 分析服务返回 ${response.status}。`);
    }

    return normalizeResult(payload);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("AI 分析请求超时，请稍后重试。");
    }
    if (error instanceof TypeError) {
      throw new Error("无法连接 AI 分析服务，请确认本地代理已启动。");
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}
