# MaaS Hub - Java 后端 (Spring Boot 3 + MySQL 8.0)

本项目为 **MaaS Hub 大模型即服务统一治理平台** 的企业级后端工程。负责大模型上游供应商集成、统一 API 密钥网关代理、流式代理中继、细粒度调用链审计、以及多维算力费用自动化计量核算。

## 架构技术栈
- **核心框架**: Java 17+ / Spring Boot 3.3.4
- **数据库**: MySQL 8.0+ (InnoDB 引擎, utf8mb4 字符集)
- **持久层框架**: MyBatis-Plus 3.5.7 / HikariCP 高性能连接池
- **HTTP/SSE 网关**: OkHttp3 4.12.0 (全异步非阻塞流式支持)
- **安全与权限**: Spring Security + JJWT (HMAC-SHA256)
- **JSON 序列化**: FastJSON2 + Jackson

## 快速启动指南

### 1. 初始化 MySQL 数据库
确保本地或云服务器已启动 MySQL 8.0 服务，并执行以下脚本：
```bash
# 导入建表 DDL 与索引
mysql -u root -p < src/main/resources/schema-mysql.sql

# 导入默认生产种子数据 (供应商预置、初始化密钥、模型目录)
mysql -u root -p < src/main/resources/data-mysql.sql
```

### 2. 配置数据库连接
在 `src/main/resources/application.yml` 中或通过环境变量配置数据库：
```bash
export MYSQL_HOST=localhost
export MYSQL_PORT=3306
export MYSQL_DATABASE=maas_hub
export MYSQL_USERNAME=root
export MYSQL_PASSWORD=your_password
```

### 3. 编译并运行
```bash
mvn clean package -DskipTests
java -jar target/maas-hub-backend-1.0.0.jar
```

服务启动后：
- 网关统一推理入口: `POST http://localhost:8080/v1/chat/completions`
- 模型目录查询: `GET http://localhost:8080/v1/models`
- 后台管理 REST API: `http://localhost:8080/api/v1/*`

## 核心数据库表设计
1. `sys_user`: 系统用户与部门租户
2. `llm_provider`: 大模型供应商配置表 (加密存储 API Key、端点、协议、多活权重)
3. `llm_model`: 基础模型目录及按百万 Token 计费单价表
4. `gateway_api_key`: 统一对外 API 密钥、RPM/TPM 流控阈值、月度软预算配额
5. `gateway_invocation_log`: 细粒度调用审计链日志 (Trace ID, Token数, TTFT, 响应延迟, 扣费金额)
6. `billing_daily_stat`: 日级多维度财务费用汇总表
