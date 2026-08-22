pipeline {

    agent any

    environment {
        BACKEND_IMAGE = "ankitghodekar/devsecops-api"
        FRONTEND_IMAGE = "ankitghodekar/devsecops-frontend"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/ankitghodekar19/devsecops-todo-app.git'
            }
        }

        stage('Backend Test') {
            steps {
                dir('app') {
                    sh '''
                    npm install
                    npm test
                    '''
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('frontend') {
                    sh '''
                    npm install
                    npm run build
                    '''
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh '''
                docker build -t $BACKEND_IMAGE:latest ./app
                docker build -t $FRONTEND_IMAGE:latest ./frontend
                '''
            }
        }

        stage('Trivy Security Scan') {
            steps {
                sh '''
                echo "Scanning backend image..."
                trivy image --severity HIGH,CRITICAL --exit-code 1 $BACKEND_IMAGE:latest

                echo "Scanning frontend image..."
                trivy image --severity HIGH,CRITICAL --exit-code 1 $FRONTEND_IMAGE:latest
                '''
            }
        }
    }

    post {
        success {
            echo "DevSecOps CI Pipeline Completed Successfully"
        }

        failure {
            echo "Pipeline Failed - Security vulnerabilities or build/test failure detected"
        }
    }
}
