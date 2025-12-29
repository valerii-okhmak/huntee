# Huntee — Deployment Guide

This project is fully containerized and ready to run on any server or local machine using Docker.

## Prerequisites

Ensure you have the following installed:
- **Docker**
- **Docker Compose**

---

## 🛠 Step 1: Create the Deployment File

You do not need to clone the repository or install Java/Node.js manually.
Simply create a folder (e.g., `huntee_deploy`) and create a file named **`docker-compose.yml`** inside it.

Paste the following configuration into `docker-compose.yml`:

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


## Step 2: Run the Project
Open your terminal in the folder containing docker-compose.yml and run:
```bash
docker-compose up -d
```
*Note: Please wait 30-60 seconds after starting. The database needs time to initialize, and the backend needs time to create the necessary tables.*

## Step 3: Access Points
Once running, the application is available at:
Web Application http://localhostOr your server's public IP
Database localhost:3306 User: root, Pass: root, DB: huntee

## Management Commands
Stop the application: 
```bash 
docker-compose down
```
Update to the latest version:
```bash 
docker-compose pull
docker-compose up -d
```
Reset Database (Delete all data):
```bash 
docker-compose down -v
docker-compose up -d
```