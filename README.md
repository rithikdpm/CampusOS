# CampusOS

CampusOS is a full-stack campus management platform designed to streamline administrative workflows, user authentication, and departmental management. The project is architected with a Spring Boot REST API backend, a React (Vite) frontend, and a MySQL 8.0 relational database, fully orchestrated with Docker and Docker Compose.

---

## Architecture Overview

* **Frontend:** React (Vite), SPA architecture, responsive user interface.
* **Backend:** Spring Boot (Java 17/21), Spring Data JPA (Hibernate), Spring Security with stateless JWT authentication, BCrypt password hashing.
* **Database:** MySQL 8.0 with externalized volume persistence.
* **Containerization:** Multi-container orchestration using Docker Compose and isolated bridge networking.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React, Vite, Axios, HTML5/CSS3 |
| **Backend** | Spring Boot, Spring Security, Hibernate |
| **Database** | MySQL 8.0 |
| **DevOps** | Docker, Docker Compose |
| **Security** | JSON Web Tokens (JWT), Role-Based Access Control (RBAC) |

---

## Prerequisites

Before running this project, ensure you have installed:
* [Git](https://git-scm.com/)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (running with Docker Compose support)
* [Java Development Kit (JDK 17+)](https://adoptium.net/) *(optional for local development outside Docker)*
* [Node.js (18+) & npm](https://nodejs.org/) *(optional for local frontend development)*

---

## Quick Start (Docker Compose)

### 1. Clone the Repository
```bash
git clone [https://github.com/rithikdpm/CampusOS.git](https://github.com/rithikdpm/CampusOS.git)
cd CampusOS
