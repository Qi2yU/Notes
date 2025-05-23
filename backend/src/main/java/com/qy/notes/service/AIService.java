package com.qy.notes.service;

import com.qy.notes.model.base.ApiResponse;
import com.qy.notes.model.vo.ai.QuestionAnswerVO;
import reactor.core.publisher.Flux;

public interface AIService {
    /**
     * 获取ai生成的问题结果
     *
     * @param questionId 问题 ID
     * @return 返回一个携带流式ai生成结果的 ApiResponse 对象
     */
//    Flux<String> getAiQuestionAnswer(Integer questionId);

    ApiResponse<QuestionAnswerVO> getAiQuestionAnswer(Integer questionId);
}
