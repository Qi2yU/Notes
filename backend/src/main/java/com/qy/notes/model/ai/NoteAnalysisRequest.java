package com.qy.notes.model.ai;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * 笔记分析请求模型
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NoteAnalysisRequest {
    
    /**
     * 笔记内容
     */
    @NotBlank(message = "笔记内容不能为空")
    private String content;
    
    /**
     * 笔记标题
     */
    private String title;
    
    /**
     * 分析类型
     */
    @NotNull(message = "分析类型不能为空")
    private AnalysisType analysisType;
    
    /**
     * 用户ID
     */
    private Long userId;
    
    /**
     * 笔记ID
     */
    private Long noteId;
    
    /**
     * 分析类型枚举
     */
    public enum AnalysisType {
        SUMMARY("生成摘要"),
        CATEGORY("分类建议"), 
        TAGS("标签建议"),
        OPTIMIZE("内容优化"),
        EXPLAIN_CODE("代码解释"),
        GENERATE_OUTLINE("生成大纲"),
        FIND_ERRORS("发现错误"),
        RELATED_TOPICS("相关主题");
        
        private final String description;
        
        AnalysisType(String description) {
            this.description = description;
        }
        
        public String getDescription() {
            return description;
        }
    }
} 