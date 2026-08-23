pipeline {

    agent any
    tools {
        sonarQube 'SonarScanner'
    }
    environment {
        BACKEND_IMAGE  = "ankitghodekar/devsecops-api"
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

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh '''
                        sonar-scanner
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
                    echo "Building backend image..."
                    docker build -t $BACKEND_IMAGE:$BUILD_NUMBER ./app
                    docker tag $BACKEND_IMAGE:$BUILD_NUMBER $BACKEND_IMAGE:latest

                    echo "Building frontend image..."
                    docker build -t $FRONTEND_IMAGE:$BUILD_NUMBER ./frontend
                    docker tag $FRONTEND_IMAGE:$BUILD_NUMBER $FRONTEND_IMAGE:latest

                    echo "Docker images built successfully."
                '''
            }
        }

        stage('Trivy Security Scan') {
            steps {
                sh '''
                    echo "========================================"
                    echo "Scanning Backend Image"
                    echo "========================================"

                    trivy image \
                        --severity HIGH,CRITICAL \
                        --exit-code 1 \
                        --no-progress \
                        $BACKEND_IMAGE:$BUILD_NUMBER

                    echo "Backend security scan passed."

                    echo "========================================"
                    echo "Scanning Frontend Image"
                    echo "========================================"

                    trivy image \
                        --severity HIGH,CRITICAL \
                        --exit-code 1 \
                        --no-progress \
                        $FRONTEND_IMAGE:$BUILD_NUMBER

                    echo "Frontend security scan passed."
                '''
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {
                    sh '''
                        echo "$DOCKER_PASSWORD" | docker login \
                            -u "$DOCKER_USERNAME" \
                            --password-stdin

                        echo "Pushing backend image..."
                        docker push $BACKEND_IMAGE:$BUILD_NUMBER
                        docker push $BACKEND_IMAGE:latest

                        echo "Pushing frontend image..."
                        docker push $FRONTEND_IMAGE:$BUILD_NUMBER
                        docker push $FRONTEND_IMAGE:latest

                        docker logout

                        echo "Images pushed successfully."
                    '''
                }
            }
        }
    }

    post {

        success {
            echo "========================================"
            echo "DevSecOps CI/CD Pipeline SUCCESS"
            echo "========================================"
            echo "Tests: PASSED"
            echo "SonarQube: PASSED"
            echo "Build: PASSED"
            echo "Trivy: PASSED"
            echo "Docker Hub: PUSHED"
        }

        failure {
            echo "========================================"
            echo "DevSecOps Pipeline FAILED"
            echo "========================================"
            echo "Check the failed stage above."
        }
    }
}
