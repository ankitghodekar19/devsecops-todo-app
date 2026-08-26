# 🚀 DevSecOps Todo Application

A hands-on **DevSecOps CI/CD and GitOps project** demonstrating an end-to-end software delivery workflow using Jenkins, SonarQube, OWASP Dependency-Check, Trivy, Docker, Docker Hub, Kubernetes, Argo CD, and Amazon EKS.

The project demonstrates how application code can move from a developer Git push through automated testing and security checks, container image publishing, GitOps manifest updates, and finally **automatic deployment to Kubernetes through Argo CD**.

---

## 🏗️ End-to-End Architecture

```text
                              Developer
                                  │
                                  │ Git Push
                                  ▼
                         ┌──────────────────┐
                         │     GitHub       │
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
                 ┌────────────────┼─────────────────┐
                 │                │                 │
                 ▼                ▼                 ▼
          Backend Tests      SonarQube          OWASP
              Jest            Analysis       Dependency-Check
                 │                │                 │
                 └────────────────┼─────────────────┘
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
                         │ Container Scan   │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │    Docker Hub    │
                         │ Versioned Images │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ GitOps Manifests │
                         │                  │
                         │ Image tag        │
                         │ updated by       │
                         │ Jenkins          │
                         └────────┬─────────┘
                                  │
                                  │ Git Commit
                                  ▼
                         ┌──────────────────┐
                         │     GitHub       │
                         │ GitOps Source    │
                         └────────┬─────────┘
                                  │
                         Detects Git Change
                                  │
                                  ▼
                         ┌──────────────────┐
                         │     Argo CD      │
                         │ GitOps Controller │
                         └────────┬─────────┘
                                  │
                            Automatic Sync
                                  │
                                  ▼
                    ┌──────────────────────────┐
                    │       Amazon EKS         │
                    │       Kubernetes         │
                    └────────────┬─────────────┘
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
                ▼                ▼                ▼
          ┌───────────┐    ┌───────────┐   ┌───────────┐
          │ Frontend  │    │  Backend  │   │   MySQL   │
          │ React     │    │ Node.js   │   │   8.4     │
          │ Nginx     │    │ Express   │   │           │
          └─────┬─────┘    └─────┬─────┘   └─────┬─────┘
                │                │                │
                │                │                ▼
                │                │          ┌───────────┐
                │                │          │    PVC    │
                │                │          │ Persistent│
                │                │          │  Storage  │
                │                │          └───────────┘
                │                │
                └───────┬────────┘
                        ▼
                  Application
```

---

# ⭐ Project Highlights

* End-to-end DevSecOps CI/CD pipeline using Jenkins
* GitHub webhook-triggered Jenkins builds
* Automated backend testing using Jest
* SonarQube static code analysis
* SonarQube Quality Gate enforcement
* OWASP Dependency-Check
* Docker image security scanning using Trivy
* Docker image versioning using Jenkins build numbers
* Docker Hub image publishing
* Automated GitOps Kubernetes manifest updates
* **Argo CD-based continuous deployment**
* **Automatic synchronization from GitHub to Kubernetes**
* Amazon EKS deployment
* Kubernetes namespace isolation using `devsecops`
* React + Nginx frontend
* Node.js + Express backend
* MySQL 8.4 database
* Kubernetes Services for application communication
* Kubernetes PersistentVolumeClaim for MySQL
* Docker Compose support for local development
* Security integrated directly into the CI/CD pipeline
* AWS infrastructure cleaned up after testing to control costs

---

# 🧩 Application Architecture

The application is a three-tier application consisting of:

```text
                  ┌─────────────────────┐
                  │      Frontend       │
                  │   React + Nginx     │
                  └──────────┬──────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │       Backend       │
                  │ Node.js + Express   │
                  └──────────┬──────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │       MySQL 8.4     │
                  │      Database       │
                  └──────────┬──────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │ Kubernetes PVC      │
                  │ Persistent Storage  │
                  └─────────────────────┘
```

The frontend communicates with the backend API, while the backend connects to MySQL through the internal Kubernetes service.

---

# 🛠️ Technology Stack

| Category            | Technology               |
| ------------------- | ------------------------ |
| Frontend            | React, Vite              |
| Web Server          | Nginx                    |
| Backend             | Node.js, Express         |
| Database            | MySQL 8.4                |
| Testing             | Jest                     |
| Containerization    | Docker                   |
| Local Orchestration | Docker Compose           |
| CI/CD               | Jenkins                  |
| Source Control      | Git, GitHub              |
| Code Quality        | SonarQube                |
| Quality Gate        | SonarQube                |
| Dependency Security | OWASP Dependency-Check   |
| Container Security  | Trivy                    |
| Container Registry  | Docker Hub               |
| Orchestration       | Kubernetes               |
| Cloud Platform      | AWS                      |
| Kubernetes Platform | Amazon EKS               |
| GitOps              | GitHub + Argo CD         |
| Persistent Storage  | Kubernetes PVC / AWS EBS |

---

# 📁 Project Structure

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

> **Note:** The Kubernetes MySQL Secret is intentionally excluded from Git. The required `mysql-secret` must be created separately before deploying the application.

---

# 🔄 CI/CD Pipeline

The Jenkins pipeline automates the continuous integration and image delivery process.

```text
Developer
    │
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
    ├── Trivy Scan
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

Jenkins checks out the `main` branch from the GitHub repository.

The repository contains:

* Application source code
* Dockerfiles
* Kubernetes manifests
* GitOps manifests
* Jenkins pipeline
* SonarQube configuration

---

## 2. Trigger Protection

The pipeline checks the latest Git commit message.

Jenkins itself updates the GitOps manifests after a successful pipeline.

That Git commit triggers another GitHub webhook.

To prevent an infinite Jenkins → GitHub → Jenkins loop, the pipeline detects Jenkins-generated GitOps commits.

Example:

```text
Update images to build 34
```

When this type of commit is detected, Jenkins skips the normal CI pipeline.

---

## 3. Backend Testing

The backend dependencies are installed and Jest tests are executed.

```bash
cd app
npm install
npm test
```

Tests run before the Docker images are built.

---

## 4. SonarQube Analysis

The backend source code is analyzed using SonarQube.

The analysis checks for:

* Bugs
* Vulnerabilities
* Code smells
* Maintainability issues
* Code quality problems

---

## 5. SonarQube Quality Gate

Jenkins waits for the SonarQube Quality Gate result.

If the Quality Gate fails, the Jenkins pipeline stops.

This prevents code that does not meet the configured quality criteria from continuing through the pipeline.

---

## 6. OWASP Dependency-Check

Application dependencies are scanned using OWASP Dependency-Check.

The pipeline checks dependencies against known vulnerabilities.

The configured CVSS threshold determines when the pipeline should fail.

The generated reports are archived by Jenkins.

---

## 7. Frontend Build

The React application is built using Vite.

```bash
cd frontend
npm install
npm run build
```

The production build is then used by the frontend Docker image.

---

## 8. Docker Build

Jenkins builds two Docker images:

```text
ankitghodekar/devsecops-api
ankitghodekar/devsecops-frontend
```

Images are tagged with the Jenkins build number.

Example:

```text
ankitghodekar/devsecops-api:34
ankitghodekar/devsecops-frontend:34
```

The pipeline also creates the `latest` tag.

---

## 9. Trivy Container Security Scan

The Docker images are scanned using Trivy.

The pipeline checks:

```text
HIGH
CRITICAL
```

vulnerabilities.

The configured Trivy policy can fail the pipeline when vulnerabilities meet the specified severity.

Example:

```bash
trivy image \
  --severity HIGH,CRITICAL \
  --exit-code 1 \
  --no-progress \
  IMAGE_NAME
```

---

## 10. Docker Hub Publishing

After successful security scanning, Jenkins authenticates with Docker Hub and pushes the images.

Example:

```text
ankitghodekar/devsecops-api:34
ankitghodekar/devsecops-api:latest

ankitghodekar/devsecops-frontend:34
ankitghodekar/devsecops-frontend:latest
```

Using Jenkins build numbers provides traceable image versions.

---

# 🔁 GitOps Deployment

The most important part of the deployment architecture is the separation between **CI and CD**.

Jenkins is responsible for building and publishing the application.

**Argo CD is responsible for deploying the desired state to Kubernetes.**

Jenkins does not directly deploy the application using `kubectl apply`.

Instead, Jenkins updates the GitOps manifests.

```text
                  Jenkins
                     │
                     │
              Docker Images
                     │
                     ▼
                Docker Hub
                     │
                     │
                     ▼
              Update GitOps
                 Manifests
                     │
                     ▼
                  GitHub
                     │
              Git change detected
                     │
                     ▼
                 Argo CD
                     │
              Automatic Sync
                     │
                     ▼
               Amazon EKS
```

This follows the GitOps principle that the Git repository contains the desired deployment configuration.

---

# 🚀 Argo CD Continuous Deployment

Argo CD is used as the continuous delivery component of the project.

The GitOps manifests are stored in the `gitops/` directory.

After Jenkins successfully builds, scans, and pushes a new image, it changes the image tag in the GitOps deployment manifest.

For example:

```yaml
image: ankitghodekar/devsecops-api:34
```

and:

```yaml
image: ankitghodekar/devsecops-frontend:34
```

Jenkins commits the change to GitHub.

Argo CD monitors the Git repository and detects the updated desired state.

Argo CD then synchronizes the Kubernetes resources with the repository.

```text
GitOps Repository
       │
       │ Desired State
       ▼
     Argo CD
       │
       │ Sync
       ▼
 Kubernetes Cluster
```

This means a successful Jenkins pipeline can result in a new application version being deployed to Kubernetes **without Jenkins directly executing Kubernetes deployment commands**.

---

# ☸️ Amazon EKS Deployment

The application was deployed and tested on **Amazon Elastic Kubernetes Service (EKS)**.

The EKS environment was used to demonstrate the complete cloud-native deployment workflow.

The application runs inside the Kubernetes namespace:

```text
devsecops
```

The deployment contains:

```text
devsecops namespace
│
├── Frontend Deployment
│   └── React + Nginx
│
├── Frontend Service
│   └── LoadBalancer
│
├── Backend Deployment
│   └── Node.js + Express
│
├── Backend Service
│   └── ClusterIP
│
├── MySQL Deployment
│   └── MySQL 8.4
│
├── MySQL Service
│   └── ClusterIP
│
└── MySQL PVC
    └── Persistent Storage
```

---

# ☁️ EKS Architecture

```text
                         Internet
                            │
                            ▼
                 ┌─────────────────────┐
                 │ frontend-service    │
                 │    LoadBalancer     │
                 └──────────┬──────────┘
                            │
                            ▼
                    Frontend Pods
                    React + Nginx
                            │
                            │ API Requests
                            ▼
                 ┌─────────────────────┐
                 │ backend-service     │
                 │      ClusterIP      │
                 └──────────┬──────────┘
                            │
                            ▼
                    Backend Pods
                  Node.js + Express
                            │
                            │ MySQL Connection
                            ▼
                 ┌─────────────────────┐
                 │ mysql-service       │
                 │      ClusterIP      │
                 └──────────┬──────────┘
                            │
                            ▼
                      MySQL 8.4
                            │
                            ▼
                 ┌─────────────────────┐
                 │   PersistentVolume  │
                 │       Claim         │
                 └─────────────────────┘
```

---

# 🧱 Kubernetes Resources

## Frontend

The frontend runs as a Kubernetes Deployment with multiple replicas.

The application is packaged using Docker and served through Nginx.

The frontend is exposed externally through:

```text
Service Type: LoadBalancer
```

This allows the application to receive traffic through an AWS-managed load balancer.

---

## Backend

The backend runs as a Kubernetes Deployment with multiple replicas.

The application is built using:

```text
Node.js
Express
```

The backend is exposed internally using:

```text
Service Type: ClusterIP
```

The frontend communicates with the backend through the Kubernetes service.

---

## MySQL

MySQL runs inside Kubernetes using:

```text
MySQL 8.4
```

The database is exposed internally using:

```text
mysql-service
```

The backend connects to MySQL through this Kubernetes service instead of using a hard-coded IP address.

---

# 💾 Persistent Storage

MySQL uses a Kubernetes PersistentVolumeClaim.

```text
MySQL Pod
    │
    ▼
PersistentVolumeClaim
    │
    ▼
AWS-backed persistent storage
```

The GitOps configuration requests:

```yaml
storage: 5Gi
```

with:

```yaml
accessModes:
  - ReadWriteOnce
```

and:

```yaml
storageClassName: gp2
```

This demonstrates persistent database storage rather than storing MySQL data only inside the container filesystem.

---

# 🔐 Kubernetes Secrets

Database configuration is supplied through a Kubernetes Secret.

The application uses the following configuration:

```text
MYSQL_DATABASE
MYSQL_USER
MYSQL_PASSWORD
MYSQL_ROOT_PASSWORD
```

The Secret manifest is intentionally excluded from Git.

The backend receives the database configuration through Kubernetes environment variables using `secretKeyRef`.

This prevents database credentials from being directly embedded inside the backend Deployment manifest.

---

# 🔄 Complete Deployment Lifecycle

The complete application deployment follows this process:

```text
1. Developer pushes code
          │
          ▼
2. GitHub receives commit
          │
          ▼
3. GitHub webhook triggers Jenkins
          │
          ▼
4. Jenkins checks out source
          │
          ▼
5. Jest backend tests
          │
          ▼
6. SonarQube analysis
          │
          ▼
7. SonarQube Quality Gate
          │
          ▼
8. OWASP Dependency-Check
          │
          ▼
9. Frontend production build
          │
          ▼
10. Docker images built
          │
          ▼
11. Trivy image security scan
          │
          ▼
12. Images pushed to Docker Hub
          │
          ▼
13. Jenkins updates GitOps YAML
          │
          ▼
14. GitOps change committed to GitHub
          │
          ▼
15. Argo CD detects Git change
          │
          ▼
16. Argo CD synchronizes Kubernetes
          │
          ▼
17. EKS performs application update
          │
          ▼
18. New frontend/backend image versions run
```

This provides a complete **CI → Security → Containerization → Registry → GitOps → Continuous Deployment** workflow.

---

# 🧪 Testing

## Backend Tests

```bash
cd app
npm install
npm test
```

## Frontend Build

```bash
cd frontend
npm install
npm run build
```

---

# 🐳 Run Locally with Docker Compose

The application can also be run locally without Kubernetes or AWS.

## Clone the repository

```bash
git clone https://github.com/ankitghodekar19/devsecops-todo-app.git
cd devsecops-todo-app
```

## Start the application

```bash
docker compose up --build
```

## Check containers

```bash
docker compose ps
```

## Stop the application

```bash
docker compose down
```

---

# 🔐 DevSecOps Security Architecture

Security controls are integrated into the CI/CD pipeline.

```text
                         Source Code
                             │
                             ▼
                         Jenkins
                             │
            ┌────────────────┼────────────────┐
            │                │                │
            ▼                ▼                ▼
        SonarQube          OWASP            Jest
        Analysis       Dependency Check     Tests
            │                │                │
            └────────────────┼────────────────┘
                             │
                             ▼
                       Docker Build
                             │
                             ▼
                           Trivy
                             │
                             ▼
                     Docker Hub Images
                             │
                             ▼
                       GitOps Update
                             │
                             ▼
                         Argo CD
                             │
                             ▼
                           EKS
```

---

# 🛡️ Security Controls

| Security Layer      | Tool                   | Purpose                             |
| ------------------- | ---------------------- | ----------------------------------- |
| Application Testing | Jest                   | Automated backend testing           |
| Static Analysis     | SonarQube              | Code quality and security analysis  |
| Quality Gate        | SonarQube              | Prevent low-quality builds          |
| Dependency Security | OWASP Dependency-Check | Detect vulnerable dependencies      |
| Container Security  | Trivy                  | Detect Docker image vulnerabilities |
| Secrets             | Kubernetes Secrets     | Protect database configuration      |
| Registry            | Docker Hub             | Store versioned container images    |

---

# 🔒 Repository Security

The repository intentionally excludes generated files and sensitive configuration such as:

* `.env` files
* `node_modules/`
* Build artifacts
* Kubernetes Secret manifests
* Terraform state files
* Log files
* IDE configuration

The Kubernetes database Secret is created separately and is not committed to the repository.

---

# 📊 CI/CD vs GitOps Responsibilities

A key design decision in this project is separating CI responsibilities from CD responsibilities.

| Component        | Responsibility                            |
| ---------------- | ----------------------------------------- |
| GitHub           | Source code and GitOps configuration      |
| Jenkins          | CI pipeline and image delivery            |
| Jest             | Application testing                       |
| SonarQube        | Static analysis and Quality Gate          |
| OWASP            | Dependency vulnerability scanning         |
| Docker           | Application containerization              |
| Trivy            | Container vulnerability scanning          |
| Docker Hub       | Container image registry                  |
| GitOps manifests | Desired Kubernetes image versions         |
| Argo CD          | Continuous deployment and synchronization |
| Kubernetes       | Container orchestration                   |
| Amazon EKS       | Managed Kubernetes platform               |
| MySQL            | Application database                      |

---

# 🎯 Why Argo CD Is Used

Instead of allowing Jenkins to directly modify the Kubernetes cluster, this project uses Argo CD.

```text
Traditional Jenkins Deployment

Jenkins
   │
   └── kubectl apply
             │
             ▼
         Kubernetes
```

The project uses:

```text
GitOps Deployment

Jenkins
   │
   ▼
GitHub
   │
   ▼
Argo CD
   │
   ▼
Kubernetes
```

This provides a cleaner separation of responsibilities.

GitHub contains the desired Kubernetes configuration, while Argo CD continuously works to keep the cluster synchronized with that desired state.

---

# ☸️ EKS Deployment Demonstration

The project was successfully tested on an Amazon EKS environment.

The deployment demonstrated:

* Kubernetes Deployments
* Multiple frontend/backend replicas
* Kubernetes Services
* LoadBalancer-based frontend exposure
* Internal ClusterIP communication
* MySQL running in Kubernetes
* PersistentVolumeClaim for MySQL
* Kubernetes Secrets
* GitOps manifests
* Argo CD synchronization
* Automatic application updates from Git changes

The EKS environment was intentionally removed after testing to avoid unnecessary AWS infrastructure charges.

The infrastructure can be recreated when another demonstration is required.

---

# 📈 What This Project Demonstrates

This project demonstrates practical experience with the complete DevOps lifecycle:

```text
Source Control
      │
      ▼
Continuous Integration
      │
      ▼
Automated Testing
      │
      ▼
Static Code Analysis
      │
      ▼
Security Scanning
      │
      ▼
Containerization
      │
      ▼
Container Registry
      │
      ▼
GitOps
      │
      ▼
Continuous Deployment
      │
      ▼
Kubernetes
      │
      ▼
Amazon EKS
```

It also demonstrates the ability to integrate security into the delivery process rather than treating security as a separate manual activity.

---

# 🎯 Project Goals

This project was built to demonstrate practical knowledge of:

* Linux
* Git & GitHub
* Git workflows
* Docker
* Docker Compose
* Jenkins
* CI/CD
* Jenkins Pipelines
* SonarQube
* SonarQube Quality Gates
* OWASP Dependency-Check
* Trivy
* Docker Hub
* Kubernetes
* Kubernetes Services
* Kubernetes Deployments
* Kubernetes Persistent Storage
* Kubernetes Secrets
* Argo CD
* GitOps
* Amazon EKS
* AWS infrastructure
* Container security
* Automated testing
* DevSecOps practices

---

# 👨‍💻 Author

**Ankit Ghodekar**

GitHub:

https://github.com/ankitghodekar19

---

# ⚠️ Disclaimer

This project is intended for learning, portfolio, and demonstration purposes.

AWS resources such as EKS clusters, EC2 instances, NAT Gateways, Load Balancers, EBS volumes, and other infrastructure can generate charges.

Cloud infrastructure should be deleted or scaled down when it is not required.

For this project, the EKS environment was removed after testing to avoid unnecessary AWS infrastructure costs.
