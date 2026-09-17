-- ==========================================================
-- MaaS Hub 基础预置数据 (生产级默认种子数据)
-- ==========================================================

-- 1. 系统管理员与测试账号
INSERT INTO `sys_user` (`id`, `username`, `password_hash`, `real_name`, `email`, `avatar`, `role`, `department`, `organization`, `status`) VALUES
('usr-001', 'admin', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.uaEkjRtkzyvGvviQnyO5Ceq', '系统总架构师', 'admin@maas-enterprise.com', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop&q=80', 'admin', '平台架构部', '企业AI算力调度中心', 1),
('usr-002', 'developer_ai', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.uaEkjRtkzyvGvviQnyO5Ceq', '智能算法工程师', 'algo@maas-enterprise.com', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop&q=80', 'developer', '算法研发中心', '智能制造研究院', 1),
('usr-003', 'finance_lead', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.uaEkjRtkzyvGvviQnyO5Ceq', '财务精算审计总监', 'finance@maas-enterprise.com', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&fit=crop&q=80', 'finance', '财务运营部', '企业AI算力调度中心', 1);

-- 2. 预置上游大模型供应商
INSERT INTO `llm_provider` (`id`, `code`, `name`, `logo_url`, `protocol`, `base_url`, `api_key`, `status`, `latency_ms`, `error_rate`, `weight`, `is_custom`, `description`) VALUES
('prov-deepseek', 'deepseek', 'DeepSeek (深度求索)', 'https://api.iconify.design/simple-icons:deepin.svg', 'openai-compatible', 'https://api.deepseek.com/v1', 'sk-dpsk-enc-789a6b5c4d3e2f10', 'active', 260, 0.0012, 100, 0, '国内顶尖国产开源大模型，深度推理 R1 与 通用模型 V3，高性价比与强逻辑推理'),
('prov-openai', 'openai', 'OpenAI (公有云网关)', 'https://api.iconify.design/simple-icons:openai.svg', 'openai-compatible', 'https://api.openai.com/v1', 'sk-oai-enc-992388102a9bcefa', 'active', 480, 0.0035, 90, 0, '业界基准 GPT-4o / o1 / o3 推理系列，全球顶尖多模态与代码生成能力'),
('prov-anthropic', 'anthropic', 'Anthropic Claude', 'https://api.iconify.design/simple-icons:anthropic.svg', 'anthropic', 'https://api.anthropic.com/v1', 'sk-ant-enc-5566778899aabbcc', 'active', 520, 0.0020, 85, 0, 'Claude 3.5 Sonnet / Haiku 系列，超长窗口 200K 上下文理解与顶级编程能力'),
('prov-qwen', 'qwen', '通义千问 (Qwen-Max)', 'https://api.iconify.design/simple-icons:alibabadotcom.svg', 'openai-compatible', 'https://dashscope.aliyuncs.com/compatible-mode/v1', 'sk-qwen-enc-33441122aabb', 'active', 190, 0.0008, 95, 0, '阿里全模态开源基座，中文文化理解深厚，企业专有私有化部署支持良好'),
('prov-ollama', 'ollama', '私有算力集群 (Ollama K8s)', 'https://api.iconify.design/simple-icons:ollama.svg', 'ollama', 'http://10.200.88.10:11434/v1', 'ollama-internal-bearer-token', 'active', 65, 0.0000, 100, 1, '企业机房内网自建 8×H800 GPU 集群，承载内部敏感合规数据与离线微调推理任务');

-- 3. 预置基础大模型列表
INSERT INTO `llm_model` (`id`, `provider_id`, `name`, `display_name`, `category`, `context_window`, `max_output_tokens`, `price_prompt_per_million`, `price_completion_per_million`, `enabled`, `description`) VALUES
('deepseek-r1', 'prov-deepseek', 'deepseek-reasoner', 'DeepSeek-R1 (深度推理大模型)', 'reasoning', 65536, 8192, 4.0000, 16.0000, 1, '具备强化学习思维链 (CoT) 的超强推理模型，擅长数学、代码及复杂规划'),
('deepseek-v3', 'prov-deepseek', 'deepseek-chat', 'DeepSeek-V3 (通用多能大模型)', 'chat', 65536, 8192, 1.0000, 2.0000, 1, '最新 671B MoE 架构，性能比肩顶级商用闭源模型，价格极具普惠优势'),
('gpt-4o', 'prov-openai', 'gpt-4o', 'GPT-4o (Omni 全能旗舰)', 'vision', 128000, 16384, 18.0000, 72.0000, 1, '原生多模态旗舰模型，图像、文档图表解析精准，指令遵从度极高'),
('o1-preview', 'prov-openai', 'o1-preview', 'OpenAI o1 (慢思考推理模型)', 'reasoning', 128000, 32768, 108.0000, 432.0000, 1, '专门针对复杂科研、数学证明与高难度程序架构设计的深度思考模型'),
('claude-3-5-sonnet', 'prov-anthropic', 'claude-3-5-sonnet-20241022', 'Claude 3.5 Sonnet (编程与长文本王牌)', 'code', 200000, 8192, 21.6000, 108.0000, 1, '业界领先的代码生成与架构重构，支持200K超大上下文分析'),
('qwen-max', 'prov-qwen', 'qwen-max', 'Qwen-Max (通义千问超大规模版)', 'chat', 32768, 8192, 20.0000, 60.0000, 1, '中文语义理解深厚，适合智能公文写作、企业知识检索增强 RAG'),
('llama3-70b-local', 'prov-ollama', 'llama3:70b-instruct', 'Llama 3 70B (本地高密算力部署)', 'chat', 8192, 4096, 0.0000, 0.0000, 1, '企业机房私有化部署，内网千兆直连，无任何外部公网数据出境风险');

-- 4. 预置统一网关 API 密钥
INSERT INTO `gateway_api_key` (`id`, `name`, `key_prefix`, `secret_token`, `user_id`, `department`, `status`, `allowed_models`, `rate_limit_rpm`, `rate_limit_tpm`, `monthly_quota_cny`, `used_quota_cny`, `total_calls`, `created_at`, `last_used_at`) VALUES
('key-01', '企业智能工单助手 (客服 Agent)', 'maas-sk-live-01', 'maas-sk-live-0198f7e2a9b3c4d5e6f7a8b9c0d1e2f3', 'usr-001', '客户服务中心', 'active', '["*"]', 1200, 800000, 10000.00, 3240.6500, 48290, '2026-01-10 09:00:00', NOW()),
('key-02', '智能代码审查与研发 Copilot', 'maas-sk-live-02', 'maas-sk-live-02a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2', 'usr-002', '软件研发中心', 'active', '["deepseek-r1","claude-3-5-sonnet","deepseek-v3"]', 1800, 1200000, 15000.00, 8912.4000, 124500, '2026-01-15 14:30:00', NOW()),
('key-03', '企业财务报表智能归因系统', 'maas-sk-live-03', 'maas-sk-live-03c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8', 'usr-003', '财务管理部', 'active', '["deepseek-r1","gpt-4o"]', 300, 200000, 5000.00, 820.1500, 6800, '2026-02-01 10:00:00', NOW()),
('key-04', '知识图谱与内部 Wiki RAG', 'maas-sk-live-04', 'maas-sk-live-04e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0', 'usr-001', '架构技术委员会', 'active', '["*"]', 600, 500000, 8000.00, 1560.8000, 23410, '2026-02-12 11:20:00', NOW()),
('key-05', '算法预研与模型压测测试沙箱', 'maas-sk-test-01', 'maas-sk-test-01f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5', 'usr-002', 'AI 创新实验室', 'active', '["*"]', 60, 50000, 500.00, 88.5000, 1240, '2026-03-01 16:00:00', NOW());
