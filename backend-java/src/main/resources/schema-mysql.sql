-- ==========================================================
-- MaaS Hub (大模型即服务统一治理与网关平台) MySQL 8.0 数据表结构
-- 字符集: utf8mb4 / 排序规则: utf8mb4_unicode_ci
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `maas_hub` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `maas_hub`;

-- 1. 系统用户与租户表 (sys_user)
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user` (
  `id` VARCHAR(64) NOT NULL COMMENT '用户唯一ID',
  `username` VARCHAR(64) NOT NULL COMMENT '登录账号',
  `password_hash` VARCHAR(255) NOT NULL COMMENT '哈希密码',
  `real_name` VARCHAR(64) NOT NULL COMMENT '真实姓名',
  `email` VARCHAR(128) DEFAULT NULL COMMENT '企业邮箱',
  `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像链接',
  `role` VARCHAR(32) NOT NULL DEFAULT 'developer' COMMENT '角色: admin, developer, finance',
  `department` VARCHAR(64) NOT NULL DEFAULT '研发中心' COMMENT '归属业务部门',
  `organization` VARCHAR(128) NOT NULL DEFAULT '企业大模型联合创新实验室' COMMENT '企业机构',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态: 1-启用, 0-禁用',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  KEY `idx_department` (`department`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统用户及租户组织表';

-- 2. 大模型上游供应商表 (llm_provider)
DROP TABLE IF EXISTS `llm_provider`;
CREATE TABLE `llm_provider` (
  `id` VARCHAR(64) NOT NULL COMMENT '供应商主键ID',
  `code` VARCHAR(64) NOT NULL COMMENT '唯一标识码 (deepseek, openai, anthropic, qwen, ollama等)',
  `name` VARCHAR(128) NOT NULL COMMENT '供应商显示名称',
  `logo_url` VARCHAR(255) DEFAULT NULL COMMENT '厂商Logo',
  `protocol` VARCHAR(32) NOT NULL DEFAULT 'openai-compatible' COMMENT '通信协议: openai-compatible, anthropic, gemini, ollama',
  `base_url` VARCHAR(255) NOT NULL COMMENT '上游服务基地址 (如 https://api.deepseek.com/v1)',
  `api_key` VARCHAR(255) NOT NULL COMMENT '上游访问凭证API Key (AES加密存储)',
  `status` VARCHAR(32) NOT NULL DEFAULT 'active' COMMENT '通道状态: active-正常, degraded-降级, offline-下线',
  `latency_ms` INT NOT NULL DEFAULT 0 COMMENT '最近心跳延迟(毫秒)',
  `error_rate` DECIMAL(5,4) NOT NULL DEFAULT 0.0000 COMMENT '最近错误率统计',
  `weight` INT NOT NULL DEFAULT 100 COMMENT '多活调度权重(1-100)',
  `is_custom` TINYINT NOT NULL DEFAULT 0 COMMENT '是否企业私有/本地集群: 1-是, 0-公有云',
  `description` VARCHAR(512) DEFAULT NULL COMMENT '供应商职能定位与备注',
  `is_deleted` TINYINT NOT NULL DEFAULT 0 COMMENT '逻辑删除',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_provider_code` (`code`, `is_deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='大模型上游供应商管理表';

-- 3. 大模型基础资产与单价目录表 (llm_model)
DROP TABLE IF EXISTS `llm_model`;
CREATE TABLE `llm_model` (
  `id` VARCHAR(64) NOT NULL COMMENT '模型型号ID (如 deepseek-chat, gpt-4o)',
  `provider_id` VARCHAR(64) NOT NULL COMMENT '关联供应商ID',
  `name` VARCHAR(128) NOT NULL COMMENT '上游模型调用标头名称',
  `display_name` VARCHAR(128) NOT NULL COMMENT '界面友好显示名称',
  `category` VARCHAR(32) NOT NULL DEFAULT 'chat' COMMENT '类别: chat-通用对话, reasoning-深度推理, code-代码, vision-多模态',
  `context_window` INT NOT NULL DEFAULT 65536 COMMENT '上下文窗口上限(Tokens)',
  `max_output_tokens` INT NOT NULL DEFAULT 8192 COMMENT '最大单次生成上限(Tokens)',
  `price_prompt_per_million` DECIMAL(10,4) NOT NULL DEFAULT 0.0000 COMMENT '输入单价 (元/100万Tokens)',
  `price_completion_per_million` DECIMAL(10,4) NOT NULL DEFAULT 0.0000 COMMENT '输出单价 (元/100万Tokens)',
  `enabled` TINYINT NOT NULL DEFAULT 1 COMMENT '是否启用: 1-启用, 0-禁用',
  `description` VARCHAR(255) DEFAULT NULL COMMENT '模型特点简述',
  `is_deleted` TINYINT NOT NULL DEFAULT 0 COMMENT '逻辑删除',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_provider_id` (`provider_id`),
  KEY `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='大模型基础目录与计费单价表';

-- 4. 统一网关 API 密钥与配额表 (gateway_api_key)
DROP TABLE IF EXISTS `gateway_api_key`;
CREATE TABLE `gateway_api_key` (
  `id` VARCHAR(64) NOT NULL COMMENT '密钥记录ID',
  `name` VARCHAR(128) NOT NULL COMMENT '应用/业务方名称',
  `key_prefix` VARCHAR(32) NOT NULL COMMENT '密钥前缀掩码 (如 maas-sk-live-01...)',
  `secret_token` VARCHAR(255) NOT NULL COMMENT '统一网关调用Token',
  `user_id` VARCHAR(64) NOT NULL COMMENT '责任人用户ID',
  `department` VARCHAR(64) NOT NULL COMMENT '核算归属部门',
  `status` VARCHAR(32) NOT NULL DEFAULT 'active' COMMENT '状态: active-有效, disabled-停用, expired-过期',
  `allowed_models` TEXT NOT NULL COMMENT '授权模型列表 JSON 数组，*代表全部',
  `rate_limit_rpm` INT NOT NULL DEFAULT 600 COMMENT '每分钟请求上限 (RPM)',
  `rate_limit_tpm` INT NOT NULL DEFAULT 300000 COMMENT '每分钟Token上限 (TPM)',
  `monthly_quota_cny` DECIMAL(12,2) NOT NULL DEFAULT 5000.00 COMMENT '月度授权软预算金额 (元)',
  `used_quota_cny` DECIMAL(12,4) NOT NULL DEFAULT 0.0000 COMMENT '当月累计已消耗金额 (元)',
  `total_calls` BIGINT NOT NULL DEFAULT 0 COMMENT '历史总调用次数',
  `ip_whitelist` VARCHAR(512) DEFAULT NULL COMMENT 'IP 白名单 (分号分隔)',
  `expires_at` DATETIME DEFAULT NULL COMMENT '过期时间',
  `last_used_at` DATETIME DEFAULT NULL COMMENT '最后调用时间',
  `is_deleted` TINYINT NOT NULL DEFAULT 0 COMMENT '逻辑删除',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_secret_token` (`secret_token`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='统一网关 API 密钥与配额流控表';

-- 5. 细粒度网关调用日志与审计表 (gateway_invocation_log)
DROP TABLE IF EXISTS `gateway_invocation_log`;
CREATE TABLE `gateway_invocation_log` (
  `id` VARCHAR(64) NOT NULL COMMENT '全局唯一 Trace ID',
  `api_key_id` VARCHAR(64) NOT NULL COMMENT '关联密钥ID',
  `api_key_name` VARCHAR(128) NOT NULL COMMENT '关联密钥名称',
  `user_name` VARCHAR(64) NOT NULL COMMENT '调用方人员',
  `provider_id` VARCHAR(64) NOT NULL COMMENT '实际承接的供应商ID',
  `provider_name` VARCHAR(128) NOT NULL COMMENT '供应商名称',
  `model_id` VARCHAR(64) NOT NULL COMMENT '模型标识',
  `model_name` VARCHAR(128) NOT NULL COMMENT '模型显示名称',
  `prompt_tokens` INT NOT NULL DEFAULT 0 COMMENT '输入 Token 数量',
  `completion_tokens` INT NOT NULL DEFAULT 0 COMMENT '输出 Token 数量',
  `total_tokens` INT NOT NULL DEFAULT 0 COMMENT '总计 Token 数量',
  `prompt_snippet` TEXT DEFAULT NULL COMMENT '请求 Prompt 摘要',
  `response_snippet` MEDIUMTEXT DEFAULT NULL COMMENT '模型响应内容摘要/思考链',
  `latency_ms` INT NOT NULL DEFAULT 0 COMMENT '端到端总延迟 (毫秒)',
  `ttft_ms` INT NOT NULL DEFAULT 0 COMMENT '首字时延 TTFT (毫秒)',
  `status_code` INT NOT NULL DEFAULT 200 COMMENT 'HTTP 状态码 (200, 429, 502 等)',
  `cost_cny` DECIMAL(10,6) NOT NULL DEFAULT 0.000000 COMMENT '单次调用核算费用 (元)',
  `ip_address` VARCHAR(64) DEFAULT NULL COMMENT '客户端来源 IP',
  `error_message` VARCHAR(512) DEFAULT NULL COMMENT '报错详情',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '请求发生时间',
  PRIMARY KEY (`id`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_api_key_id` (`api_key_id`),
  KEY `idx_provider_model` (`provider_id`, `model_id`),
  KEY `idx_status_code` (`status_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='网关链路调用日志与全生命周期审计表';

-- 6. 每日费用与用量聚合汇总表 (billing_daily_stat)
DROP TABLE IF EXISTS `billing_daily_stat`;
CREATE TABLE `billing_daily_stat` (
  `id` BIGINT AUTO_INCREMENT NOT NULL COMMENT '自增主键',
  `stat_date` DATE NOT NULL COMMENT '统计日期 (YYYY-MM-DD)',
  `provider_id` VARCHAR(64) NOT NULL COMMENT '供应商ID',
  `model_id` VARCHAR(64) NOT NULL COMMENT '模型ID',
  `department` VARCHAR(64) NOT NULL COMMENT '部门',
  `call_count` INT NOT NULL DEFAULT 0 COMMENT '当日调用次数',
  `prompt_tokens` BIGINT NOT NULL DEFAULT 0 COMMENT '输入Tokens',
  `completion_tokens` BIGINT NOT NULL DEFAULT 0 COMMENT '输出Tokens',
  `total_cost_cny` DECIMAL(12,4) NOT NULL DEFAULT 0.0000 COMMENT '总计产生费用(元)',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_date_prov_model_dept` (`stat_date`, `provider_id`, `model_id`, `department`),
  KEY `idx_stat_date` (`stat_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='每日用量与费用聚合报表';
