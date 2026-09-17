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
 * 上游大模型供应商实体类 (MySQL: llm_provider)
 */
@Data
@TableName("llm_provider")
public class LlmProvider implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_ID)
    private String id;

    private String code;

    private String name;

    private String logoUrl;

    private String protocol;

    private String baseUrl;

    private String apiKey;

    private String status;

    private Integer latencyMs;

    private BigDecimal errorRate;

    private Integer weight;

    private Integer isCustom;

    private String description;

    @TableLogic
    private Integer isDeleted;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
