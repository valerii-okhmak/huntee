package org.dreamteam.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ChoiceOptionDTO {

    private Long optionId;
    private String optionText;
    private String imageUrl; 

    @JsonProperty("isCorrect")
    private boolean isCorrect;

    public ChoiceOptionDTO(Long optionId, String optionText, String imageUrl, boolean isCorrect) {
        this.optionId = optionId;
        this.optionText = optionText;
        this.imageUrl = imageUrl;
        this.isCorrect = isCorrect;
    }

    public ChoiceOptionDTO(String optionText, String imageUrl, boolean isCorrect) {
        this.optionText = optionText;
        this.imageUrl = imageUrl;
        this.isCorrect = isCorrect;
    }
}