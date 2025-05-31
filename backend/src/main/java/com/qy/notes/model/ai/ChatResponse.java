package com.qy.notes.model.ai;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

/**
 * AI聊天响应模型
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatResponse {
    
    /**
     * AI回复内容
     */
    private String content;
    
    /**
     * 会话ID
     */
    private String sessionId;
    
    /**
     * 响应时间
     */
    private LocalDateTime timestamp;
    
    /**
     * 模型名称
     */
    private String model;
    
    /**
     * 使用的token数量
     */
    private TokenUsage tokenUsage;
    
    /**
     * 是否成功
     */
    private Boolean success;
    
    /**
     * 错误信息（如果有）
     */
    private String errorMessage;
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class TokenUsage {
        private Integer promptTokens;     // 输入token数
        private Integer completionTokens; // 输出token数
        private Integer totalTokens;      // 总token数
    }
    
    /**
     * 创建成功响应
     */
    public static ChatResponse success(String content, String sessionId, String model) {
        return ChatResponse.builder()
                .content(content)
                .sessionId(sessionId)
                .model(model)
                .timestamp(LocalDateTime.now())
                .success(true)
                .build();
    }
    
    /**
     * 创建失败响应
     */
    public static ChatResponse error(String errorMessage, String sessionId) {
        return ChatResponse.builder()
                .sessionId(sessionId)
                .timestamp(LocalDateTime.now())
                .success(false)
                .errorMessage(errorMessage)
                .build();
    }
} 