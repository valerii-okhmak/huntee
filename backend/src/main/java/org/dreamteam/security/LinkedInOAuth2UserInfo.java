package org.dreamteam.security;

import java.util.Map;

public class LinkedInOAuth2UserInfo extends OAuth2UserInfo {

    public LinkedInOAuth2UserInfo(Map<String, Object> attributes) {
        super(attributes);
    }

    @Override
    public String getId() {
        return (String) attributes.get("id");
    }

    @Override
    public String getName() {
        return (String) attributes.get("localizedFirstName") + " " + (String) attributes.get("localizedLastName");
    }

    @Override
    public String getEmail() {
        // LinkedIn doesn't provide email in basic profile
        // Need to make a separate API call for email
        return ""; // Will be handled separately in the OAuth2 service
    }

    @Override
    public String getImageUrl() {
        // LinkedIn doesn't provide image URL in basic profile
        // Need to make a separate API call for profile image
        return null;
    }
}
