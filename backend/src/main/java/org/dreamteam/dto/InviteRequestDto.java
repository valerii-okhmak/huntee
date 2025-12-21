package org.dreamteam.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InviteRequestDto {

    @NotBlank(message = "Email не може бути порожнім")
    @Email(message = "Невірний формат email адреси")
    private String email;
}