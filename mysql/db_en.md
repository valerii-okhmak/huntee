# Database

## Creating the database
```sql
    create database Huntee;
    use Huntee;

    -- Table for user types (admin, company, user)
    CREATE TABLE user_types (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL
    );

    -- Table for users
    CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE,
        password_hash VARCHAR(255), 
        verification_code VARCHAR(6),
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        user_type_id INT NOT NULL,
        FOREIGN KEY (user_type_id) REFERENCES user_types(id)
    );

    -- Table for user profiles (one-to-one with the users table)
    CREATE TABLE profiles (
        user_id INT PRIMARY KEY,
        profile_image_url VARCHAR(255),
        first_name VARCHAR(100) not NULL,
        last_name VARCHAR(100),

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Table for OAuth 2.0 providers
    CREATE TABLE oauth_providers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL -- 'google', 'linkedin', 'facebook'
    );

    -- Table for OAuth 2.0 identities
    CREATE TABLE oauth_identities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        provider_id INT NOT NULL,
        provider_user_id VARCHAR(255) NOT NULL, 
        access_token TEXT NOT NULL,
        refresh_token TEXT,
        expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY (provider_id, provider_user_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (provider_id) REFERENCES oauth_providers(id)
    );

    -- Indexes for search optimization 
    CREATE INDEX idx_users_email ON users (email);
    CREATE INDEX idx_oauth_identities_user_id ON oauth_identities (user_id);
    CREATE INDEX idx_oauth_identities_provider_user_id ON oauth_identities (provider_user_id);
```


## Basic data
```sql
    -- User types
    INSERT INTO user_types (id, name) VALUES
    (1, 'USER'),
    (2, 'ADMIN');

    -- OAuth providers
    INSERT INTO auth_providers (id, name) VALUES
    (1, 'LOCAL'),
    (2, 'GOOGLE'),
    (3, 'FACEBOOK'),
    (4, 'LINKEDIN');
```

## Clearing data except for base data
```sql
    -- 1. Disable foreign key checks
    SET FOREIGN_KEY_CHECKS = 0;

    -- 2. Truncate tables in the correct order
    TRUNCATE TABLE users;
    TRUNCATE TABLE user_types;
    TRUNCATE TABLE auth_providers;

    -- 3. Re-enable foreign key checks
    SET FOREIGN_KEY_CHECKS = 1;
```