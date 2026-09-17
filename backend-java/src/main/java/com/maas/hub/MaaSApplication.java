package com.maas.hub;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * MaaS Hub - 企业级大模型即服务统一网关与治理平台
 * 支持多上游模型动态路由、统一API Key分发、细粒度调用链审计与费用核算
 */
@SpringBootApplication
@EnableScheduling
@EnableAsync
@MapperScan("com.maas.hub.mapper")
public class MaaSApplication {

    public static void main(String[] args) {
        SpringApplication.run(MaaSApplication.class, args);
        System.out.println("=================================================");
        System.out.println("  MaaS Hub (Spring Boot 3 + MySQL) 网关已成功启动 ");
        System.out.println("  统一模型调用入口: http://localhost:8080/v1/chat/completions");
        System.out.println("  治理管理接口文档: http://localhost:8080/doc.html");
        System.out.println("=================================================");
    }
}
