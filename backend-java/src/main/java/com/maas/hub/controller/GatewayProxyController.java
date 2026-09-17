package com.maas.hub.controller;

import com.maas.hub.service.GatewayProxyService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyEmitter;

import java.util.Map;

/**
 * 统一大模型网关转发控制器
 * 兼容 OpenAI /v1/chat/completions 标准规范
 * 客户端只需配置 baseURL = "http://maas-server:8080/v1" 以及平台颁发的统一 API Key，即可透传调用任意接入模型
 */
@RestController
@RequestMapping("/v1")
public class GatewayProxyController {

    @Autowired
    private GatewayProxyService gatewayProxyService;

    /**
     * 核心统一对话补全接口 (支持流式 SSE 和同步返回)
     */
    @PostMapping(value = "/chat/completions", produces = MediaType.APPLICATION_JSON_VALUE)
    public Object chatCompletions(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody Map<String, Object> requestBody,
            HttpServletRequest request,
            HttpServletResponse response) {

        // 提取客户端统一 Bearer Token
        String token = gatewayProxyService.extractToken(authHeader);

        // 校验密钥有效性、模型授权权限、RPM/TPM 流控及当月预算软硬限额
        gatewayProxyService.validateApiKeyAndQuota(token, requestBody);

        boolean isStream = Boolean.TRUE.equals(requestBody.get("stream"));
        if (isStream) {
            response.setContentType(MediaType.TEXT_EVENT_STREAM_VALUE);
            response.setCharacterEncoding("UTF-8");
            return gatewayProxyService.handleStreamingProxy(token, requestBody, request, response);
        } else {
            return gatewayProxyService.handleSyncProxy(token, requestBody, request);
        }
    }

    /**
     * 模型目录列表 (兼容 /v1/models)
     */
    @GetMapping("/models")
    public Map<String, Object> listModels(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        String token = gatewayProxyService.extractToken(authHeader);
        return gatewayProxyService.getAuthorizedModels(token);
    }
}
