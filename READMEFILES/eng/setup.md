# Huntee — Deployment Guide

This project is fully containerized and ready to run on any server or local machine using Docker.

## Prerequisites

Ensure you have the following installed:
- **Docker**
- **Docker Compose**

---

## 🛠 Step 1: Create the Deployment File

You do not need to clone the repository or install Java/Node.js manually.
Simply create a folder (e.g., `huntee_deploy`) and add a **`docker-compose.yml`** file inside it.


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