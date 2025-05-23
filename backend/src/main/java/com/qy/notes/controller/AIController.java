package com.qy.notes.controller;

import com.qy.notes.mapper.QuestionMapper;
import com.qy.notes.model.base.ApiResponse;
import com.qy.notes.model.dto.note.CreateNoteRequest;
import com.qy.notes.model.entity.Note;
import com.qy.notes.model.entity.Question;
import com.qy.notes.model.vo.ai.QuestionAnswerVO;
import com.qy.notes.model.vo.question.QuestionNoteVO;
import com.qy.notes.scope.RequestScopeData;
import com.qy.notes.service.AIService;
import com.qy.notes.service.ChatStreamingModel;
import com.qy.notes.utils.ApiResponseUtil;
import jakarta.validation.constraints.Min;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

@Slf4j
@Validated
@RestController
@RequestMapping("/api")
public class AIController {

    @Autowired
    private AIService aiService;

    @GetMapping("/AI/{questionId}")
    public ApiResponse<QuestionAnswerVO> getAiAnswer(@Min(value = 1, message = "questionId 必须为正整数")
                                           @PathVariable Integer questionId){
        return aiService.getAiQuestionAnswer(questionId);
    }
}
