package com.maas.hub.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 统一网关 API 密钥与配额控制实体 (MySQL: gateway_api_key)
 */
@Data
@TableName("gateway_api_key")
public class GatewayApiKey implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    private String id;

    private String name;

    private String keyPrefix;

    private String secretToken;

    private String userId;

    private String department;

    private String status;

    private String allowedModels;

    private Integer rateLimitRpm;

    private Integer rateLimitTpm;

    private BigDecimal monthlyQuotaCny;

    private BigDecimal usedQuotaCny;

    private Long totalCalls;

    private String ipWhitelist;

    private LocalDateTime expiresAt;

    private LocalDateTime lastUsedAt;

    @TableLogic
    private Integer isDeleted;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
