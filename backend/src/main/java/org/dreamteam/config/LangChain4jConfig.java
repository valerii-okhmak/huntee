package org.dreamteam.config;

import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration; 

@Configuration
public class LangChain4jConfig {

    @Value("${langchain4j.google-ai-gemini.api-key}")
    private String apiKey;

    @Value("${langchain4j.google-ai-gemini.model-name}")
    private String modelName;

    @Bean("googleGeminiChatModel")
    public ChatLanguageModel chatLanguageModel() {
        return GoogleAiGeminiChatModel.builder()
                .apiKey(apiKey)
                .modelName(modelName)
                .temperature(0.7)
                .timeout(Duration.ofMinutes(5))
                .maxRetries(1)
                .build();
    }
}