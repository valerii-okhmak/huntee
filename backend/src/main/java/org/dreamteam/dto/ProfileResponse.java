package org.dreamteam.dto;


import java.util.List;

import org.dreamteam.Entity.OAuthProvider;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProfileResponse {
    private String firstName;
    private String lastName;
    private String profileImage;
    private String about;
    private Integer[] providerID;
}