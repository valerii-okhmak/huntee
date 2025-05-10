# База-даних

## Створення бд
```sql
    create database Huntee;
    use Huntee;

    -- Таблиця для типів користувачів (адмін, компанія, юзер)
    CREATE TABLE user_types (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL
    );

    -- Таблиця для користувачів
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

    -- Таблиця для профілів користувачів (один до одного з таблицею users)
    CREATE TABLE profiles (
        user_id INT PRIMARY KEY,
        profile_image_url VARCHAR(255),
        first_name VARCHAR(100) not NULL,
        last_name VARCHAR(100),

    
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Таблиця для OAuth 2.0 провайдерів
    CREATE TABLE oauth_providers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL -- 'google', 'linkedin', 'facebook'
    );

    -- Таблиця для OAuth 2.0 даних
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

    -- Індексів для оптимізації пошуку 
    CREATE INDEX idx_users_email ON users (email);
    CREATE INDEX idx_oauth_identities_user_id ON oauth_identities (user_id);
    CREATE INDEX idx_oauth_identities_provider_user_id ON oauth_identities (provider_user_id);
```


## Базові дані 
```sql
    -- Типи користувачів 
    INSERT INTO user_types (id, name) VALUES
    (1, 'USER'),
    (2, 'ADMIN');

    -- OAuth провайдери
    INSERT INTO auth_providers (id, name) VALUES
    (1, 'LOCAL'),
    (2, 'GOOGLE'),
    (3, 'FACEBOOK'),
    (4, 'LINKEDIN');
```

## Очищення даних без базових
```sql
    -- 1. Вимкнути перевірку зовнішніх ключів
    SET FOREIGN_KEY_CHECKS = 0;

    -- 2. Очистити таблиці в правильному порядку
    TRUNCATE TABLE users;
    TRUNCATE TABLE user_types;
    TRUNCATE TABLE auth_providers;

    -- 3. Увімкнути перевірку назад
    SET FOREIGN_KEY_CHECKS = 1;
```