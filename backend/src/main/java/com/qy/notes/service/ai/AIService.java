package com.qy.notes.service.ai;

import com.qy.notes.model.ai.ChatRequest;
import com.qy.notes.model.ai.ChatResponse;
import com.qy.notes.model.ai.NoteAnalysisRequest;
import com.qy.notes.model.ai.NoteAnalysisResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * AI服务层 - 提供高级AI功能
 */
@Slf4j
@Service
public class AIService {
    
    @Autowired
    private ZhipuAIClient zhipuAIClient;
    
    // 简单的会话存储（实际项目中应该使用Redis）
    private final Map<String, List<Map<String, String>>> sessionStore = new HashMap<>();
    
    /**
     * 聊天功能
     */
    public ChatResponse chat(ChatRequest request) {
        try {
            String sessionId = request.getSessionId();
            if (sessionId == null) {
                sessionId = UUID.randomUUID().toString();
            }
            
            // 获取历史上下文
            List<Map<String, String>> context = sessionStore.getOrDefault(sessionId, new ArrayList<>());
            
            // 调用AI
            String response = zhipuAIClient.chat(request.getMessage(), context);
            
            // 更新会话上下文
            Map<String, String> userMessage = new HashMap<>();
            userMessage.put("role", "user");
            userMessage.put("content", request.getMessage());
            context.add(userMessage);
            
            Map<String, String> assistantMessage = new HashMap<>();
            assistantMessage.put("role", "assistant");
            assistantMessage.put("content", response);
            context.add(assistantMessage);
            
            // 限制上下文长度（保留最近10轮对话）
            if (context.size() > 20) {
                context = context.subList(context.size() - 20, context.size());
            }
            sessionStore.put(sessionId, context);
            
            return ChatResponse.success(response, sessionId, "glm-4-air");
            
        } catch (Exception e) {
            log.error("聊天请求失败", e);
            return ChatResponse.error("AI服务暂时不可用: " + e.getMessage(), request.getSessionId());
        }
    }
    
    /**
     * 笔记分析功能
     */
    public NoteAnalysisResponse analyzeNote(NoteAnalysisRequest request) {
        try {
            String result;
            NoteAnalysisResponse response = null;
            
            switch (request.getAnalysisType()) {
                case SUMMARY:
                    result = zhipuAIClient.generateSummary(request.getContent());
                    response = NoteAnalysisResponse.success(result, request.getAnalysisType());
                    break;
                    
                case CATEGORY:
                    result = zhipuAIClient.suggestCategories(request.getContent());
                    response = NoteAnalysisResponse.success(result, request.getAnalysisType());
                    // 解析分类建议
                    List<String> categories = Arrays.asList(result.split("[,，]"));
                    response.setSuggestedCategories(categories.stream()
                            .map(String::trim)
                            .filter(s -> !s.isEmpty())
                            .toList());
                    break;
                    
                case TAGS:
                    result = zhipuAIClient.suggestTags(request.getContent());
                    response = NoteAnalysisResponse.success(result, request.getAnalysisType());
                    // 解析标签建议
                    List<String> tags = Arrays.asList(result.split("[,，]"));
                    response.setSuggestedTags(tags.stream()
                            .map(String::trim)
                            .filter(s -> !s.isEmpty())
                            .toList());
                    break;
                    
                case OPTIMIZE:
                    result = zhipuAIClient.optimizeContent(request.getContent());
                    response = NoteAnalysisResponse.success(result, request.getAnalysisType());
                    break;
                    
                case EXPLAIN_CODE:
                    // 尝试检测代码语言
                    String language = detectCodeLanguage(request.getContent());
                    result = zhipuAIClient.explainCode(request.getContent(), language);
                    response = NoteAnalysisResponse.success(result, request.getAnalysisType());
                    break;
                    
                case GENERATE_OUTLINE:
                    result = generateOutline(request.getContent());
                    response = NoteAnalysisResponse.success(result, request.getAnalysisType());
                    break;
                    
                case FIND_ERRORS:
                    result = findErrors(request.getContent());
                    response = NoteAnalysisResponse.success(result, request.getAnalysisType());
                    break;
                    
                case RELATED_TOPICS:
                    result = findRelatedTopics(request.getContent());
                    response = NoteAnalysisResponse.success(result, request.getAnalysisType());
                    // 解析相关主题
                    List<String> topics = Arrays.asList(result.split("[,，]"));
                    response.setRelatedTopics(topics.stream()
                            .map(String::trim)
                            .filter(s -> !s.isEmpty())
                            .toList());
                    break;
                    
                default:
                    throw new IllegalArgumentException("不支持的分析类型: " + request.getAnalysisType());
            }
            
            return response;
            
        } catch (Exception e) {
            log.error("笔记分析失败", e);
            return NoteAnalysisResponse.error("分析失败: " + e.getMessage(), request.getAnalysisType());
        }
    }
    
    /**
     * 检测代码语言
     */
    private String detectCodeLanguage(String content) {
        String lowerContent = content.toLowerCase();
        
        if (lowerContent.contains("public class") || lowerContent.contains("import java")) {
            return "Java";
        } else if (lowerContent.contains("function") && lowerContent.contains("var")) {
            return "JavaScript";
        } else if (lowerContent.contains("def ") || lowerContent.contains("import ")) {
            return "Python";
        } else if (lowerContent.contains("#include") || lowerContent.contains("int main")) {
            return "C++";
        } else if (lowerContent.contains("select") && lowerContent.contains("from")) {
            return "SQL";
        } else {
            return "未知语言";
        }
    }
    
    /**
     * 生成大纲
     */
    private String generateOutline(String content) throws Exception {
        String prompt = String.format(
                "请为以下技术内容生成一个清晰的大纲结构，包含主要章节和子章节：\n\n%s", 
                content
        );
        return zhipuAIClient.chat(prompt);
    }
    
    /**
     * 发现错误
     */
    private String findErrors(String content) throws Exception {
        String prompt = String.format(
                "请仔细检查以下技术内容，指出可能存在的错误、不准确的地方或可以改进的地方：\n\n%s", 
                content
        );
        return zhipuAIClient.chat(prompt);
    }
    
    /**
     * 查找相关主题
     */
    private String findRelatedTopics(String content) throws Exception {
        String prompt = String.format(
                "请分析以下技术内容，推荐5-8个相关的技术主题或概念，用逗号分隔：\n\n%s", 
                content
        );
        return zhipuAIClient.chat(prompt);
    }
    
    /**
     * 清除会话
     */
    public void clearSession(String sessionId) {
        sessionStore.remove(sessionId);
    }
    
    /**
     * 获取会话数量（用于监控）
     */
    public int getActiveSessionCount() {
        return sessionStore.size();
    }
} 