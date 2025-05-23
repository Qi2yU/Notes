package com.qy.notes.service.impl;

import com.qy.notes.mapper.QuestionMapper;
import com.qy.notes.model.base.ApiResponse;
import com.qy.notes.model.entity.Question;
import com.qy.notes.model.vo.ai.QuestionAnswerVO;
import com.qy.notes.scope.RequestScopeData;
import com.qy.notes.service.AIService;
import com.qy.notes.service.AiChatModel;
import com.qy.notes.service.ChatStreamingModel;
import com.qy.notes.utils.ApiResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Service
public class AIServiceImpl implements AIService {

    @Autowired
    private AiChatModel chatModel;

    @Autowired
    private RequestScopeData requestScopeData;

    @Autowired
    private QuestionMapper questionMapper;

    public Question findById(Integer questionId) {
        return questionMapper.findById(questionId);
    }

    @Override
    public ApiResponse<QuestionAnswerVO> getAiQuestionAnswer(Integer questionId) {
        // 验证 question 是否存在
        Question question = questionMapper.findById(questionId);
        if (question == null) {
            return ApiResponseUtil.error("没有这个问题");
        }

        if(requestScopeData.isLogin() && requestScopeData.getUserId() != null){
            String content = question.getTitle();
            String answer = chatModel.chat(content);
            if(answer == null){
                return ApiResponseUtil.error("AI回答失败");
            }
            QuestionAnswerVO questionAnswerVO = new QuestionAnswerVO();
            questionAnswerVO.setAnswer(answer);
            return ApiResponseUtil.success("AI回答成功", questionAnswerVO);
        }
        return ApiResponseUtil.error("没有登录");
    }
}
