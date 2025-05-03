package org.dreamteam.Entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "oauth_providers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OAuthProvider {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "name", unique = true, nullable = false, length = 50)
    private String name;
    
    public static final String GOOGLE = "google";
    public static final String FACEBOOK = "facebook";
    public static final String LINKEDIN = "linkedin";
}
