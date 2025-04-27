package org.dreamteam.dto;

import lombok.Data;

@Data
public class ConfirmRequest {
    private String email;
    private String code;
}
