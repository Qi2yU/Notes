package com.qy.notes.service.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.qy.notes.config.ZhipuAIConfig;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 智谱AI客户端服务
 */
@Slf4j
@Service
public class ZhipuAIClient {
    
    @Autowired
    private ZhipuAIConfig config;
    
    @Autowired
    private OkHttpClient httpClient;
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    /**
     * 发送聊天请求
     */
    public String chat(String message) throws IOException {
        return chat(message, null);
    }
    
    /**
     * 发送聊天请求（带上下文）
     */
    public String chat(String message, List<Map<String, String>> context) throws IOException {
        // 构建请求消息
        List<Map<String, String>> messages = new ArrayList<>();
        
        // 添加系统提示
        Map<String, String> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("content", "你是一个专业的技术助手，专门帮助程序员解答技术问题、分析代码、优化笔记内容。请用中文回答。");
        messages.add(systemMessage);
        
        // 添加上下文消息
        if (context != null && !context.isEmpty()) {
            messages.addAll(context);
        }
        
        // 添加用户消息
        Map<String, String> userMessage = new HashMap<>();
        userMessage.put("role", "user");
        userMessage.put("content", message);
        messages.add(userMessage);
        
        // 构建请求体
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", config.getDefaultModel());
        requestBody.put("messages", messages);
        requestBody.put("temperature", config.getDefaultTemperature());
        requestBody.put("max_tokens", config.getDefaultMaxTokens());
        
        // 发送请求
        return sendRequest(requestBody);
    }
    
    /**
     * 发送请求到智谱AI API
     */
    private String sendRequest(Map<String, Object> requestBody) throws IOException {
        String requestJson = objectMapper.writeValueAsString(requestBody);
        log.info("发送智谱AI请求: {}", requestJson);
        
        RequestBody body = RequestBody.create(
                requestJson, 
                MediaType.parse("application/json; charset=utf-8")
        );
        
        Request request = new Request.Builder()
                .url(config.getBaseUrl() + "/chat/completions")
                .post(body)
                .addHeader("Authorization", "Bearer " + config.getApiKey())
                .addHeader("Content-Type", "application/json")
                .build();
        
        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                String errorBody = response.body() != null ? response.body().string() : "Unknown error";
                log.error("智谱AI请求失败: HTTP {}, 响应: {}", response.code(), errorBody);
                throw new IOException("智谱AI请求失败: HTTP " + response.code() + ", " + errorBody);
            }
            
            String responseBody = response.body().string();
            log.info("智谱AI响应: {}", responseBody);
            
            // 解析响应
            JsonNode jsonNode = objectMapper.readTree(responseBody);
            JsonNode choices = jsonNode.get("choices");
            
            if (choices != null && choices.isArray() && choices.size() > 0) {
                JsonNode firstChoice = choices.get(0);
                JsonNode message = firstChoice.get("message");
                if (message != null) {
                    JsonNode content = message.get("content");
                    if (content != null) {
                        return content.asText();
                    }
                }
            }
            
            throw new IOException("无法从智谱AI响应中提取内容");
        }
    }
    
    /**
     * 生成笔记摘要
     */
    public String generateSummary(String noteContent) throws IOException {
        String prompt = String.format(
                "请为以下技术笔记生成一个简洁的摘要，突出核心知识点和要点，控制在200字以内：\n\n%s", 
                noteContent
        );
        return chat(prompt);
    }
    
    /**
     * 建议分类
     */
    public String suggestCategories(String noteContent) throws IOException {
        String prompt = String.format(
                "请分析以下技术笔记内容，建议3-5个合适的分类标签，用逗号分隔：\n\n%s", 
                noteContent
        );
        return chat(prompt);
    }
    
    /**
     * 建议标签
     */
    public String suggestTags(String noteContent) throws IOException {
        String prompt = String.format(
                "请为以下技术笔记推荐5-10个相关的技术标签，用逗号分隔：\n\n%s", 
                noteContent
        );
        return chat(prompt);
    }
    
    /**
     * 解释代码
     */
    public String explainCode(String code, String language) throws IOException {
        String prompt = String.format(
                "请详细解释以下%s代码的功能、实现原理和关键技术点：\n\n```%s\n%s\n```", 
                language, language, code
        );
        return chat(prompt);
    }
    
    /**
     * 优化内容
     */
    public String optimizeContent(String content) throws IOException {
        String prompt = String.format(
                "请帮助优化以下技术笔记内容，使其更加清晰、有条理、易于理解：\n\n%s", 
                content
        );
        return chat(prompt);
    }
} 