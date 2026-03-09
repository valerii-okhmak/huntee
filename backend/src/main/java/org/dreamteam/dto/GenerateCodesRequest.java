package org.dreamteam.dto;

import lombok.Data;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
public class GenerateCodesRequest {
    @NotBlank(message = "Tag cannot be blank")
    private String tag;

    @Min(value = 1, message = "Number of codes must be at least 1")
    private int count;
}
