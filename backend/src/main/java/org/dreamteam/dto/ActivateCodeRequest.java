package org.dreamteam.dto;

import lombok.Data;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;


@Data
public class ActivateCodeRequest {
    @NotBlank(message = "Code cannot be blank")
    private String code;
}