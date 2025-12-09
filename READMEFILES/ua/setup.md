
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
