# 🚀 DevSecOps Todo Application

A hands-on **DevSecOps CI/CD project** demonstrating automated testing, code quality analysis, dependency vulnerability scanning, container security, Docker image publishing, and GitOps-based Kubernetes deployment.

---

## 🏗️ Architecture

```text
                         ┌──────────────────┐
                         │    Developer     │
                         │                  │
                         │    Git Push      │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │     GitHub       │
                         │                  │
                         │ Source Repository│
                         └────────┬─────────┘
                                  │
                           GitHub Webhook
                                  │
                                  ▼
                         ┌──────────────────┐
                         │     Jenkins      │
                         │      CI/CD       │
                         └────────┬─────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
              ▼                   ▼                   ▼
        Backend Tests        SonarQube          OWASP Dependency
        npm test             Analysis           Check
              │                   │                   │
              └───────────────────┼───────────────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │   Docker Build   │
                         │                  │
                         │ Backend +        │
                         │ Frontend Images  │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │      Trivy       │
                         │ Image Security   │
                         │      Scan        │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │    Docker Hub    │
                         │                  │
                         │ Versioned Images │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ GitOps Manifests │
                         │                  │
                         │ Image version    │
                         │ updated in Git   │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │   Kubernetes /   │
                         │       EKS        │
                         └────────┬─────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    ▼             ▼             ▼
                Frontend       Backend        MySQL
                React          Node.js        8.4
                Nginx          Express
```

---

## ⭐ Project Highlights

- Automated CI/CD pipeline using Jenkins
- GitHub webhook-triggered builds
- Backend unit testing with Jest
- SonarQube static code analysis
- SonarQube Quality Gate enforcement
- OWASP Dependency-Check for dependency vulnerabilities
- Docker image vulnerability scanning with Trivy
- Docker Hub image publishing
- Jenkins build-number based image versioning
- Automated GitOps manifest updates
- Kubernetes deployment manifests
- MySQL persistent storage using PVC
- Docker Compose support for local development
- Application tested on Amazon EKS
- AWS infrastructure cleaned up after testing to control costs

---

## ✨ Features

- React frontend
- Node.js + Express backend
- MySQL 8.4 database
- Dockerized application
- Docker Compose support
- Kubernetes deployment manifests
- Amazon EKS deployment
- Jenkins CI/CD pipeline
- GitHub webhook integration
- SonarQube code quality analysis
- SonarQube Quality Gate
- OWASP Dependency-Check
- Trivy container image scanning
- Docker Hub image publishing
- GitOps-style Kubernetes manifest updates
- Versioned Docker images using Jenkins build numbers
- Kubernetes persistent storage for MySQL

---

## 🛠️ Technology Stack

| Category | Technology |
|---|---|
| Frontend | React, Vite |
| Backend | Node.js, Express |
| Database | MySQL 8.4 |
| Containerization | Docker |
| Local Orchestration | Docker Compose |
| CI/CD | Jenkins |
| Code Quality | SonarQube |
| Dependency Security | OWASP Dependency-Check |
| Container Security | Trivy |
| Container Registry | Docker Hub |
| Orchestration | Kubernetes |
| Cloud | AWS |
| Kubernetes Platform | Amazon EKS |
| GitOps | Git-based Kubernetes manifests |
| Source Control | GitHub |
| Testing | Jest |

---

## 📁 Project Structure

```text
devsecops-project/
│
├── app/
│   ├── src/
│   │   ├── app.js
│   │   ├── db.js
│   │   └── server.js
│   ├── tests/
│   │   └── health.test.js
│   ├── Dockerfile
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── package-lock.json
│
├── mysql/
│   └── init.sql
│
├── k8s/
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   ├── mysql-deployment.yaml
│   ├── mysql-pvc.yaml
│   └── mysql-service.yaml
│
├── gitops/
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   ├── mysql-deployment.yaml
│   ├── mysql-pvc.yaml
│   └── mysql-service.yaml
│
├── Jenkinsfile
├── docker-compose.yml
├── sonar-project.properties
├── .gitignore
└── README.md
```

> **Note:** The Kubernetes MySQL Secret is intentionally excluded from Git. The `mysql-secret` must be created separately before deploying the application.

---

# 🔄 CI/CD Pipeline

The Jenkins pipeline automates the application build, testing, security scanning, image publishing, and GitOps manifest update process.

## Pipeline Flow

```text
Developer
    │
    │ Git Push
    ▼
 GitHub
    │
    │ Webhook
    ▼
 Jenkins
    │
    ├── Checkout
    │
    ├── Trigger Protection
    │
    ├── Backend Tests
    │
    ├── SonarQube Analysis
    │
    ├── SonarQube Quality Gate
    │
    ├── OWASP Dependency-Check
    │
    ├── Frontend Build
    │
    ├── Docker Build
    │
    ├── Trivy Security Scan
    │
    ├── Docker Hub Push
    │
    └── Update GitOps Manifests
              │
              ▼
           GitHub
```

---

## 1. Checkout

Jenkins checks out the `main` branch from GitHub.

The repository is used as the source for the application, Dockerfiles, Kubernetes manifests, and Jenkins pipeline.

---

## 2. Trigger Protection

The pipeline checks the latest Git commit message.

Jenkins-generated GitOps commits are detected and skipped to prevent an infinite GitHub webhook loop.

For example:

```text
Update images to build 32
```

When such a commit is detected, Jenkins skips the pipeline execution.

---

## 3. Backend Tests

The backend dependencies are installed and automated tests are executed.

```bash
cd app
npm install
npm test
```

Testing is performed using **Jest**.

---

## 4. SonarQube Analysis

The backend source code is analyzed using SonarQube.

The analysis helps identify:

- Bugs
- Vulnerabilities
- Code smells
- Maintainability issues
- Code quality problems

---

## 5. SonarQube Quality Gate

After the SonarQube analysis, Jenkins waits for the configured Quality Gate.

If the Quality Gate fails, the pipeline is stopped.

This prevents low-quality code from continuing through the delivery pipeline.

---

## 6. OWASP Dependency-Check

Application dependencies are scanned for known security vulnerabilities using **OWASP Dependency-Check**.

The pipeline is configured with a CVSS threshold and can fail when vulnerabilities meet the configured severity level.

Reports are archived by Jenkins after the scan.

---

## 7. Frontend Build

The React frontend is built using Vite.

```bash
cd frontend
npm install
npm run build
```

The production frontend build is generated before the Docker image is created.

---

## 8. Docker Build

Jenkins builds two Docker images:

```text
ankitghodekar/devsecops-api
ankitghodekar/devsecops-frontend
```

Images are tagged using the Jenkins build number.

Example:

```text
ankitghodekar/devsecops-api:32
ankitghodekar/devsecops-frontend:32
```

The pipeline also maintains the `latest` tag.

---

## 9. Trivy Security Scan

The generated Docker images are scanned using **Trivy**.

The pipeline checks for:

- HIGH vulnerabilities
- CRITICAL vulnerabilities

The configured security policy can fail the pipeline when vulnerabilities meet the specified severity.

Example:

```bash
trivy image \
  --severity HIGH,CRITICAL \
  --exit-code 1 \
  --no-progress \
  IMAGE_NAME
```

---

## 10. Docker Hub Push

After successful security scanning, Jenkins authenticates with Docker Hub and pushes the images.

Both versioned and `latest` images are pushed.

Example:

```text
ankitghodekar/devsecops-api:32
ankitghodekar/devsecops-api:latest

ankitghodekar/devsecops-frontend:32
ankitghodekar/devsecops-frontend:latest
```

---

## 11. GitOps Manifest Update

After the Docker images are successfully pushed, Jenkins updates the Kubernetes deployment manifests stored in the `gitops/` directory.

For example:

```yaml
image: ankitghodekar/devsecops-api:33
```

and:

```yaml
image: ankitghodekar/devsecops-frontend:33
```

Jenkins then commits the updated manifests back to GitHub.

This creates a simple GitOps workflow where the Git repository contains the desired Kubernetes image versions.

---

# ☸️ Kubernetes Architecture

The application consists of three main components:

```text
                 ┌─────────────────────┐
                 │  frontend-service   │
                 │    LoadBalancer     │
                 └──────────┬──────────┘
                            │
                            ▼
                     React + Nginx
                            │
                            ▼
                 ┌─────────────────────┐
                 │  backend-service    │
                 │      ClusterIP      │
                 └──────────┬──────────┘
                            │
                            ▼
                     Node.js API
                            │
                            ▼
                 ┌─────────────────────┐
                 │   mysql-service     │
                 │      ClusterIP      │
                 └──────────┬──────────┘
                            │
                            ▼
                         MySQL
                            │
                            ▼
                           PVC
```

### Kubernetes Components

| Component | Kubernetes Resource | Purpose |
|---|---|---|
| Frontend | Deployment | Runs React/Nginx containers |
| Frontend Service | LoadBalancer | Exposes the frontend |
| Backend | Deployment | Runs Node.js API replicas |
| Backend Service | ClusterIP | Internal backend communication |
| MySQL | Deployment | Runs MySQL database |
| MySQL Service | ClusterIP | Internal database communication |
| MySQL Storage | PersistentVolumeClaim | Persistent database storage |
| MySQL Secret | Secret | Stores database configuration |

---

# 🐳 Run Locally with Docker Compose

The application can be run locally using Docker Compose without requiring Kubernetes or AWS.

## Clone the repository

```bash
git clone https://github.com/ankitghodekar19/devsecops-todo-app.git
cd devsecops-todo-app
```

## Start the application

```bash
docker compose up --build
```

## Check running containers

```bash
docker compose ps
```

## Stop the application

```bash
docker compose down
```

---

# 🧪 Testing

## Backend Tests

Run the backend tests:

```bash
cd app
npm install
npm test
```

## Frontend Build

Build the React frontend:

```bash
cd frontend
npm install
npm run build
```

---

# 🔐 Security

Security is integrated directly into the CI/CD pipeline.

```text
                     Source Code
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
      SonarQube        OWASP          Trivy
      Analysis       Dependency      Container
                       Check           Scan
          │              │              │
          └──────────────┼──────────────┘
                         │
                         ▼
                  Secure Docker Images
```

## Security Controls

| Security Layer | Tool | Purpose |
|---|---|---|
| Application Testing | Jest | Automated backend testing |
| Code Analysis | SonarQube | Code quality and security analysis |
| Quality Gate | SonarQube | Prevent poor-quality builds |
| Dependency Scan | OWASP Dependency-Check | Identify vulnerable dependencies |
| Container Scan | Trivy | Identify image vulnerabilities |
| Registry | Docker Hub | Store container images |

---

## 🔒 Secrets and Sensitive Files

The repository intentionally excludes sensitive files and generated artifacts such as:

- `.env` files
- `node_modules/`
- Build artifacts
- Kubernetes Secret manifests
- Terraform state files
- Log files
- IDE configuration files

The Kubernetes MySQL Secret is not committed to Git.

The following file is ignored:

```text
k8s/mysql-secret.yaml
```

Secrets should be supplied through a secure secret-management mechanism in a real production environment.

---

# ☁️ AWS / EKS Deployment

The application was tested on **Amazon EKS** using the Kubernetes manifests in this repository.

The Kubernetes configuration includes:

- Deployments
- ClusterIP Services
- LoadBalancer Service
- PersistentVolumeClaim
- Kubernetes Secrets

The EKS cluster used during development was intentionally deleted after testing to avoid unnecessary AWS infrastructure costs.

The environment can be recreated when required.

---

# 🔁 GitOps Workflow

This project implements a simple GitOps-style workflow.

```text
Developer
    │
    ▼
 GitHub
    │
    ▼
 Jenkins
    │
    ├── Test
    │
    ├── SonarQube
    │
    ├── OWASP Dependency-Check
    │
    ├── Docker Build
    │
    ├── Trivy Scan
    │
    └── Docker Hub Push
            │
            ▼
    Update GitOps YAML
            │
            ▼
         GitHub
            │
            ▼
      Kubernetes / EKS
```

Jenkins updates the image tags in the `gitops/` manifests after a successful pipeline execution.

The Git repository therefore acts as the source of truth for the Kubernetes image versions.

---

# 📊 Pipeline Security Controls

| Stage | Tool | Purpose |
|---|---|---|
| Testing | Jest | Application testing |
| Code Analysis | SonarQube | Code quality and security analysis |
| Quality Gate | SonarQube | Enforce code quality |
| Dependency Scan | OWASP Dependency-Check | Dependency vulnerability detection |
| Container Scan | Trivy | Docker image vulnerability detection |
| Registry | Docker Hub | Container image storage |
| Deployment | Kubernetes | Application orchestration |
| GitOps | GitHub | Kubernetes configuration management |

---

# 🎯 Project Goals

This project was built to demonstrate practical DevOps and DevSecOps knowledge in:

- Linux
- Git & GitHub
- Docker
- Docker Compose
- Jenkins
- CI/CD
- SonarQube
- OWASP Dependency-Check
- Trivy
- Kubernetes
- Amazon EKS
- Docker Hub
- GitOps concepts
- Application security
- Container security
- Automated testing

---

# 📚 What This Project Demonstrates

The project demonstrates an end-to-end delivery workflow:

```text
Code
 │
 ▼
GitHub
 │
 ▼
Jenkins
 │
 ├── Automated Testing
 │
 ├── Static Code Analysis
 │
 ├── Quality Gate
 │
 ├── Dependency Security Scan
 │
 ├── Docker Build
 │
 ├── Container Security Scan
 │
 └── Docker Image Publishing
          │
          ▼
    GitOps Manifest Update
          │
          ▼
       Kubernetes
          │
          ▼
        Amazon EKS
```

This provides practical exposure to integrating security controls directly into the CI/CD process rather than treating security as a separate step.

---

# 👨‍💻 Author

**Ankit Ghodekar**

GitHub:  
https://github.com/ankitghodekar19

---

# ⚠️ Disclaimer

This project is intended for learning, portfolio, and demonstration purposes.

AWS infrastructure such as EKS clusters, EC2 instances, NAT Gateways, Load Balancers, EBS volumes, and other resources can generate costs.

Cloud infrastructure should be deleted or scaled down when it is not required.

For this project, the EKS environment was deleted after testing to avoid unnecessary AWS charges.
