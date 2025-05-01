# Huntee Installation & Setup

This document provides a step-by-step guide for locally running the Huntee platform.


## 1. Clone the Repository

Clone the project from GitHub:

```bash
git clone https://github.com/DONAT1N/huntee.git 
```

## 2. Frontend Installation & Launch

1. Navigate to the frontend directory:

```bash
cd huntee/frontend
```

2. Install dependencies:

```bash
npm install
```

3. Run the frontend:

```bash
npm run dev
```
The interface will be available at: http://localhost:3000

## 3. Backend Installation & Launch
1. Make sure Java 17+ and Maven are installed on your system.
2. Navigate to the backend directory:

```bash
cd ../backend
```

3. Build the project:

```bash
./mvnw clean install
```

4. Start the server:

```bash
./mvnw spring-boot:run
```
The API will be accessible at: http://localhost:8080

## 4. Note

> Make sure ports 3000 (frontend) and 8080 (backend) are not occupied by other processes.
> To ensure proper communication between frontend and backend, check the proxy field in frontend/package.json.


## Directory Structure

```bash
huntee/
├── backend/         # Backend server
├── frontend/        # Frontend application
└── READMEFILESeng   # Documentation
    ├── README.md       
    └── docs.eng/
        ├── companies.md
        ├── setup.md
        ├── students.md
        ├── technologies.md
        └── test-format.md

```
