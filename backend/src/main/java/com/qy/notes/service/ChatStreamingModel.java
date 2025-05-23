package com.qy.notes.service;

import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.TokenStream;
import dev.langchain4j.service.spring.AiService;
import reactor.core.publisher.Flux;

@AiService
public interface ChatStreamingModel {
    @SystemMessage("你是一个计算机领域的知识库，请根据接下来的有关计算机方面的知识，给出详细回答")
    TokenStream chatStream(String userMessage);

    @SystemMessage("你是一个计算机领域的知识库，请根据接下来的有关计算机方面的知识，给出详细回答")
    Flux<String> chatStreamFlux(String userMessage);
}
