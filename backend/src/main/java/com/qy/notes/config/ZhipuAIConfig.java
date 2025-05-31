package com.qy.notes.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import okhttp3.OkHttpClient;

import java.time.Duration;

/**
 * 智谱AI配置类
 */
@Configuration
@ConfigurationProperties(prefix = "zhipu.ai")
@Data
public class ZhipuAIConfig {
    
    /**
     * API Key
     */
    private String apiKey = "f22b521f28ee4627be95303bf3e07b8c.LELtlyWKBWcFYRXe";
    
    /**
     * API基础URL
     */
    private String baseUrl = "https://open.bigmodel.cn/api/paas/v4";
    
    /**
     * 默认模型
     */
    private String defaultModel = "glm-4-air";
    
    /**
     * 连接超时时间（秒）
     */
    private int connectTimeout = 30;
    
    /**
     * 读取超时时间（秒）
     */
    private int readTimeout = 60;
    
    /**
     * 写入超时时间（秒）
     */
    private int writeTimeout = 60;
    
    /**
     * 最大重试次数
     */
    private int maxRetries = 3;
    
    /**
     * 默认温度参数
     */
    private double defaultTemperature = 0.7;
    
    /**
     * 默认最大tokens
     */
    private int defaultMaxTokens = 1000;
    
    /**
     * 配置OkHttpClient
     */
    @Bean
    public OkHttpClient okHttpClient() {
        return new OkHttpClient.Builder()
                .connectTimeout(Duration.ofSeconds(connectTimeout))
                .readTimeout(Duration.ofSeconds(readTimeout))
                .writeTimeout(Duration.ofSeconds(writeTimeout))
                .retryOnConnectionFailure(true)
                .build();
    }
} 