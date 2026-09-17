export type UserRole = 'admin' | 'developer' | 'finance';

export interface User {
  id: string;
  username: string; // 登录账号
  password?: string; // 密码
  name: string; // 真实姓名
  email: string;
  avatar: string;
  role: UserRole;
  roleLabel: string;
  department: string;
  organization: string;
  status: 'active' | 'disabled';
  phone?: string;
  monthlyQuotaCny?: number;
  lastLoginAt?: string;
  createdAt: string;
}

export type ProviderProtocol = 'openai-compatible' | 'anthropic' | 'gemini' | 'ollama';

export interface ModelPricing {
  promptPerMillion: number; // in CNY (¥ per 1M tokens)
  completionPerMillion: number; // in CNY (¥ per 1M tokens)
}

export interface ModelItem {
  id: string;
  name: string;
  displayName: string;
  providerId: string;
  contextWindow: number; // e.g. 128000
  maxOutputTokens: number;
  pricing: ModelPricing;
  enabled: boolean;
  category: 'chat' | 'reasoning' | 'code' | 'vision' | 'embedding';
  description?: string;
}

export interface Provider {
  id: string;
  name: string;
  code: string; // e.g. 'deepseek', 'openai', 'anthropic', 'qwen', 'zhipu', 'gemini', 'ollama', 'custom'
  logoUrl?: string;
  protocol: ProviderProtocol;
  baseUrl: string;
  apiKey: string; // masked in UI, stored for gateway routing
  status: 'active' | 'degraded' | 'offline' | 'unconfigured';
  models: ModelItem[];
  latencyMs: number;
  errorRate: number; // percentage, e.g. 0.05
  weight: number; // load balancing priority / weight 1-100
  isCustom: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiKeyConfig {
  id: string;
  name: string;
  keyPrefix: string; // e.g. "maas-sk-live-..."
  fullKey: string;
  userId: string;
  userName: string;
  department: string;
  status: 'active' | 'disabled' | 'expired';
  allowedModels: string[]; // ['*'] for all, or specific model ids
  rateLimitRpm: number; // Requests per minute
  rateLimitTpm: number; // Tokens per minute
  monthlyQuotaCny: number; // e.g. 5000 CNY
  usedQuotaCny: number; // e.g. 1420.50 CNY
  totalCalls: number;
  createdAt: string;
  lastUsedAt?: string;
  expiresAt?: string;
  ipWhitelist: string[];
}

export interface InvocationLog {
  id: string; // Trace ID
  timestamp: string;
  apiKeyId: string;
  apiKeyName: string;
  userId: string;
  userName: string;
  providerId: string;
  providerName: string;
  modelId: string;
  modelName: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  promptSnippet: string;
  responseSnippet: string;
  latencyMs: number;
  ttftMs: number; // Time to first token
  statusCode: number; // 200, 429, 500, 401
  costCny: number;
  ipAddress: string;
  errorMessage?: string;
  cached?: boolean;
}

export interface FilterParams {
  timeRange: '1h' | '24h' | '7d' | '30d' | 'all';
  providerId: string;
  modelId: string;
  status: string;
  apiKeyId: string;
  searchQuery: string;
}

export interface MySQLColumn {
  field: string;
  type: string;
  nullable: boolean;
  key: 'PRI' | 'UNI' | 'MUL' | '';
  defaultValue: string | null;
  comment: string;
}

export interface MySQLTable {
  name: string;
  comment: string;
  engine: string;
  rowCount: number;
  dataSizeKb: number;
  columns: MySQLColumn[];
}

export interface SqlQueryResult {
  sql: string;
  columns: string[];
  rows: Record<string, any>[];
  affectedRows: number;
  executionTimeMs: number;
  status: 'success' | 'error';
  errorMessage?: string;
}

export interface JavaSourceFile {
  path: string;
  name: string;
  language: 'java' | 'xml' | 'yaml' | 'sql';
  description: string;
  content: string;
}

