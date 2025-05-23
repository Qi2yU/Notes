package com.qy.notes.service;

import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.spring.AiService;

@AiService
public interface AiChatModel {
    @SystemMessage("你是一个计算机领域的知识库，请根据接下来的有关计算机方面的知识，给出详细回答")
    String chat(String userMessage);
}
