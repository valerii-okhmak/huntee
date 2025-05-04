package org.dreamteam.dto;

import lombok.Data;

@Data
public class ProfileRequest {
    private String firstName;
    private String lastName;
    private String profileImageUrl;
}
