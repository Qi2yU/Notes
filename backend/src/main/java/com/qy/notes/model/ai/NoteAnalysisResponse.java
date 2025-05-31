package com.qy.notes.model.ai;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 笔记分析响应模型
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NoteAnalysisResponse {
    
    /**
     * 分析结果
     */
    private String result;
    
    /**
     * 分析类型
     */
    private NoteAnalysisRequest.AnalysisType analysisType;
    
    /**
     * 建议的分类（仅当analysisType为CATEGORY时）
     */
    private List<String> suggestedCategories;
    
    /**
     * 建议的标签（仅当analysisType为TAGS时）
     */
    private List<String> suggestedTags;
    
    /**
     * 相关主题（仅当analysisType为RELATED_TOPICS时）
     */
    private List<String> relatedTopics;
    
    /**
     * 分析时间
     */
    private LocalDateTime timestamp;
    
    /**
     * 是否成功
     */
    private Boolean success;
    
    /**
     * 错误信息
     */
    private String errorMessage;
    
    /**
     * 置信度评分（0-1）
     */
    private Double confidenceScore;
    
    /**
     * 创建成功的响应
     */
    public static NoteAnalysisResponse success(String result, NoteAnalysisRequest.AnalysisType analysisType) {
        return NoteAnalysisResponse.builder()
                .result(result)
                .analysisType(analysisType)
                .timestamp(LocalDateTime.now())
                .success(true)
                .build();
    }
    
    /**
     * 创建失败的响应
     */
    public static NoteAnalysisResponse error(String errorMessage, NoteAnalysisRequest.AnalysisType analysisType) {
        return NoteAnalysisResponse.builder()
                .analysisType(analysisType)
                .timestamp(LocalDateTime.now())
                .success(false)
                .errorMessage(errorMessage)
                .build();
    }
} 