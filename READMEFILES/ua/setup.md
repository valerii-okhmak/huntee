
# 🚀 Huntee — Інструкція з розгортання

Цей проект повністю упакований у Docker-контейнери та готовий до запуску на будь-якому сервері або локальному комп'ютері.

## Вимоги

Переконайтеся, що у вас встановлено:
- **Docker**
- **Docker Compose**

---

## 🛠 Крок 1: Створення файлу конфігурації

Вам не потрібно клонувати репозиторій або встановлювати Java/Node.js вручну.
Просто створіть папку (наприклад, `huntee_deploy`) і створіть у ній файл з назвою **`docker-compose.yml`**.

Вставте наступний код у файл `docker-compose.yml`:

```yaml
version: '3.8'

services:
  db:
    image: mysql:8.0
    container_name: huntee_db
    environment:
      MYSQL_DATABASE: huntee
      MYSQL_ROOT_PASSWORD: root
    ports:
      - "3306:3306" 
    volumes:
      - db_data:/var/lib/mysql
    restart: always
    networks:
      - huntee-network

  backend:
    image: ghcr.io/donat1n/huntee-backend:latest
    container_name: huntee_backend
    environment:
      - SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/huntee?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
      - SPRING_DATASOURCE_USERNAME=root
      - SPRING_DATASOURCE_PASSWORD=root
      - SPRING_JPA_HIBERNATE_DDL_AUTO=update
      - SERVER_SERVLET_CONTEXT_PATH=/api
    depends_on:
      - db
    restart: always
    networks:
      - huntee-network

  frontend:
    image: ghcr.io/donat1n/huntee-frontend:latest
    container_name: huntee_frontend
    ports:
      - "80:80" 
    depends_on:
      - backend
    restart: always
    networks:
      - huntee-network

volumes:
  db_data:

networks:
  huntee-network:
    driver: bridge
```

## Крок 2: Запуск проекту
Відкрийте термінал у папці, де знаходиться файл docker-compose.yml, і виконайте команду:
```bash
docker-compose up -d
```
*Примітка: Будь ласка, зачекайте 30-60 секунд після запуску. Базі даних потрібен час для ініціалізації, а бекенду — для автоматичного створення таблиць.*

## Крок 3: Доступ до системи
Після запуску додаток доступний за адресами:
Web Application http://localhostOr your server's public IP
Database localhost:3306 User: root, Pass: root, DB: huntee

## Management Commands
Зупинити додаток: 
```bash 
docker-compose down
```
Оновити до останньої версії:
```bash 
docker-compose pull
docker-compose up -d
```
Скинути базу даних (Видалити всі дані):
```bash 
docker-compose down -v
docker-compose up -d
```





# ІНСТРУКЦІЯ З ЛОКАЛЬНОГО ЗАПУСКУ ПРОЄКТУ HUNTEE
Цей файл містить покрокову інструкцію для розгортання проєкту на вашому
комп'ютері. Проєкт складається з двох частин:
1. Backend (Java Spring Boot)
2. Frontend (React.js)

# 1. ПОПЕРЕДНІ ВИМОГИ 
Переконайтеся, що у вас встановлено:
- Java JDK 17 (або новіше)
- Node.js та npm
- MySQL Server
- Git
- Maven 

# 2. ЗАВАНТАЖЕННЯ КОДУ
```bash
git clone https://github.com/DONAT1N/huntee.git 
```

# 3. НАЛАШТУВАННЯ БАЗИ ДАНИХ
1. Увійдіть у свій MySQL клієнт
2. Виконайте SQL-команду для створення бази:
```sql
   CREATE DATABASE huntee;
```
*Примітка: Після запуску бекенду таблиці автоматично створяться, після чого потрібно виконайти наступний sql-запит:*
```sql
    INSERT INTO user_types (id, name) VALUES
    (1, 'USER'),
    (2, 'ADMIN');

    INSERT INTO auth_providers (id, name) VALUES
    (1, 'LOCAL'),
    (2, 'GOOGLE'),
    (3, 'FACEBOOK'),
    (4, 'LINKEDIN');
```

# 4. ЗАПУСК БЕКЕНДУ
1. Перейдіть у папку з бекендом:
   cd huntee/backend

2. Налаштуйте конфігурацію.
   Відкрийте файл src/main/resources/application.properties та внесіть надані дані.

3. Запустіть сервер:
   
   mvn spring-boot:run

   Або запустіть клас `BackendApplication.java` через вашу IDE (IntelliJ IDEA).
   Дочекайтеся повідомлення: "Tomcat started on port(s): 8080".

# 5. ЗАПУСК ФРОНТЕНДУ 
1. Відкрийте новий термінал і перейдіть у папку фронтенду:
   cd huntee/frontend

2. Встановіть необхідні бібліотеки (тільки перший раз):
   npm install

3. Створіть файл конфігурації.
   Створіть файл з назвою ".env" у папці frontend і додайте туди рядок:
   
   REACT_APP_BACKEND=http://localhost:8080

4. Запустіть клієнтську частину:

   npm start
