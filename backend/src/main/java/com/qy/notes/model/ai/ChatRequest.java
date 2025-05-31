package com.qy.notes.model.ai;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

/**
 * AI聊天请求模型
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatRequest {
    
    /**
     * 用户消息内容
     */
    @NotBlank(message = "消息内容不能为空")
    @Size(max = 4000, message = "消息内容不能超过4000字符")
    private String message;
    
    /**
     * 聊天上下文
     */
    private List<ChatMessage> context;
    
    /**
     * 会话ID
     */
    private String sessionId;
    
    /**
     * 模型参数
     */
    private ModelParams modelParams;
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ChatMessage {
        private String role; // user, assistant, system
        private String content;
    }
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ModelParams {
        private Double temperature = 0.7; // 创造性参数
        private Integer maxTokens = 1000;  // 最大回复长度
        private Double topP = 0.9;         // 核采样参数
    }
} 