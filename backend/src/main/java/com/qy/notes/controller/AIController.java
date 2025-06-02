package com.qy.notes.controller;

import com.qy.notes.model.ai.ChatRequest;
import com.qy.notes.model.ai.ChatResponse;
import com.qy.notes.model.ai.NoteAnalysisRequest;
import com.qy.notes.model.ai.NoteAnalysisResponse;
import com.qy.notes.service.ai.AIService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;

/**
 * AI功能控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/ai")
@Validated
public class AIController {
    
    @Autowired
    private AIService aiService;
    
    /**
     * AI聊天接口
     */
    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@Valid @RequestBody ChatRequest request) {
        log.info("收到AI聊天请求: {}", request.getMessage());
        ChatResponse response = aiService.chat(request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * 笔记分析接口
     */
    @PostMapping("/analyze-note")
    public ResponseEntity<NoteAnalysisResponse> analyzeNote(@Valid @RequestBody NoteAnalysisRequest request) {
        log.info("收到笔记分析请求: 类型={}, 内容长度={}", 
                request.getAnalysisType(), 
                request.getContent().length());
        NoteAnalysisResponse response = aiService.analyzeNote(request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * 生成笔记摘要
     */
    @PostMapping("/summarize")
    public ResponseEntity<NoteAnalysisResponse> summarizeNote(@RequestBody Map<String, String> requestBody) {
        String content = requestBody.get("content");
        if (content == null || content.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(
                    NoteAnalysisResponse.error("内容不能为空", NoteAnalysisRequest.AnalysisType.SUMMARY)
            );
        }
        
        NoteAnalysisRequest request = NoteAnalysisRequest.builder()
                .content(content)
                .analysisType(NoteAnalysisRequest.AnalysisType.SUMMARY)
                .build();
        
        NoteAnalysisResponse response = aiService.analyzeNote(request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * 建议分类
     */
    @PostMapping("/suggest-categories")
    public ResponseEntity<NoteAnalysisResponse> suggestCategories(@RequestBody Map<String, String> requestBody) {
        String content = requestBody.get("content");
        if (content == null || content.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(
                    NoteAnalysisResponse.error("内容不能为空", NoteAnalysisRequest.AnalysisType.CATEGORY)
            );
        }
        
        NoteAnalysisRequest request = NoteAnalysisRequest.builder()
                .content(content)
                .analysisType(NoteAnalysisRequest.AnalysisType.CATEGORY)
                .build();
        
        NoteAnalysisResponse response = aiService.analyzeNote(request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * 建议标签
     */
    @PostMapping("/suggest-tags")
    public ResponseEntity<NoteAnalysisResponse> suggestTags(@RequestBody Map<String, String> requestBody) {
        String content = requestBody.get("content");
        if (content == null || content.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(
                    NoteAnalysisResponse.error("内容不能为空", NoteAnalysisRequest.AnalysisType.TAGS)
            );
        }
        
        NoteAnalysisRequest request = NoteAnalysisRequest.builder()
                .content(content)
                .analysisType(NoteAnalysisRequest.AnalysisType.TAGS)
                .build();
        
        NoteAnalysisResponse response = aiService.analyzeNote(request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * 代码解释
     */
    @PostMapping("/explain-code")
    public ResponseEntity<NoteAnalysisResponse> explainCode(@RequestBody Map<String, String> requestBody) {
        String content = requestBody.get("content");
        if (content == null || content.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(
                    NoteAnalysisResponse.error("代码内容不能为空", NoteAnalysisRequest.AnalysisType.EXPLAIN_CODE)
            );
        }
        
        NoteAnalysisRequest request = NoteAnalysisRequest.builder()
                .content(content)
                .analysisType(NoteAnalysisRequest.AnalysisType.EXPLAIN_CODE)
                .build();
        
        NoteAnalysisResponse response = aiService.analyzeNote(request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * 优化内容
     */
    @PostMapping("/optimize")
    public ResponseEntity<NoteAnalysisResponse> optimizeContent(@RequestBody Map<String, String> requestBody) {
        String content = requestBody.get("content");
        if (content == null || content.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(
                    NoteAnalysisResponse.error("内容不能为空", NoteAnalysisRequest.AnalysisType.OPTIMIZE)
            );
        }
        
        NoteAnalysisRequest request = NoteAnalysisRequest.builder()
                .content(content)
                .analysisType(NoteAnalysisRequest.AnalysisType.OPTIMIZE)
                .build();
        
        NoteAnalysisResponse response = aiService.analyzeNote(request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * 生成大纲
     */
    @PostMapping("/generate-outline")
    public ResponseEntity<NoteAnalysisResponse> generateOutline(@RequestBody Map<String, String> requestBody) {
        String content = requestBody.get("content");
        if (content == null || content.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(
                    NoteAnalysisResponse.error("内容不能为空", NoteAnalysisRequest.AnalysisType.GENERATE_OUTLINE)
            );
        }
        
        NoteAnalysisRequest request = NoteAnalysisRequest.builder()
                .content(content)
                .analysisType(NoteAnalysisRequest.AnalysisType.GENERATE_OUTLINE)
                .build();
        
        NoteAnalysisResponse response = aiService.analyzeNote(request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * 清除会话
     */
    @DeleteMapping("/session/{sessionId}")
    public ResponseEntity<Map<String, String>> clearSession(@PathVariable String sessionId) {
        aiService.clearSession(sessionId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "会话已清除");
        return ResponseEntity.ok(response);
    }
    
    /**
     * 获取AI服务状态
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("service", "AI Service");
        status.put("status", "运行中");
        status.put("activeSessions", aiService.getActiveSessionCount());
        status.put("model", "GLM-4-Air");
        return ResponseEntity.ok(status);
    }
    
    /**
     * 测试AI连接
     */
    @PostMapping("/test")
    public ResponseEntity<ChatResponse> testConnection() {
        ChatRequest testRequest = new ChatRequest();
        testRequest.setMessage("你好，请简单介绍一下你自己。");
        
        ChatResponse response = aiService.chat(testRequest);
        return ResponseEntity.ok(response);
    }
}
