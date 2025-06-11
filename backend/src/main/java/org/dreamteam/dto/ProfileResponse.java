package org.dreamteam.dto;


import java.time.LocalDate;
import java.util.List;

import org.dreamteam.Entity.OAuthProvider;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProfileResponse {
    private Integer user_id;
    private String firstName;
    private String lastName;
    private LocalDate birthDate; 
    private String profileImage;
    private String about;
    private Integer[] providerID;
}