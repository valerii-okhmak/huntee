package org.dreamteam.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private AuthProvider provider;

    private String role = "USER"; // за замовчуванням роль

    @Column(nullable = false)
    private String firstName; // Ім'я обов'язкове

    private String lastName; // Прізвище необов'язкове
}

