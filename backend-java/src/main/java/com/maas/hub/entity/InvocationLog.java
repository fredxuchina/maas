package com.maas.hub.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 细粒度网关调用链路审计日志实体 (MySQL: gateway_invocation_log)
 */
@Data
@TableName("gateway_invocation_log")
public class InvocationLog implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.INPUT)
    private String id; // Trace ID

    private String apiKeyId;

    private String apiKeyName;

    private String userName;

    private String providerId;

    private String providerName;

    private String modelId;

    private String modelName;

    private Integer promptTokens;

    private Integer completionTokens;

    private Integer totalTokens;

    private String promptSnippet;

    private String responseSnippet;

    private Integer latencyMs;

    private Integer ttftMs;

    private Integer statusCode;

    private BigDecimal costCny;

    private String ipAddress;

    private String errorMessage;

    private LocalDateTime createdAt;
}
