package org.dreamteam.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class ProfileRequest {
    private String firstName;
    private String lastName;
    private LocalDate birthDate; 
    private String profileImageUrl;
    private String about;
}
