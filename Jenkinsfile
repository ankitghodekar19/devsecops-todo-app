
pipeline {

    agent any

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
                script {

                    def scannerHome = tool 'SonarScanner'

                    withSonarQubeEnv('SonarQube') {

                        sh """
                            echo "========================================"
                            echo "Running SonarQube analysis..."
                            echo "========================================"

                            ${scannerHome}/bin/sonar-scanner
                        """
                    }
                }
            }
        }

        stage('OWASP Dependency-Check') {
            steps {
                script {

                    def dependencyCheckHome = tool 'Dependency-Check'

                    sh """
                        echo "========================================"
                        echo "Preparing Yarn..."
                        echo "========================================"

                        npm install -g yarn

                        echo "Yarn version:"
                        yarn --version


                        echo "========================================"
                        echo "Running OWASP Dependency-Check..."
                        echo "========================================"

                        mkdir -p dependency-check-report

                        ${dependencyCheckHome}/bin/dependency-check.sh \
                            --project "DevSecOps Todo App" \
                            --scan ./app \
                            --format HTML \
                            --format XML \
                            --out dependency-check-report \
                            --failOnCVSS 7

                        echo "========================================"
                        echo "OWASP Dependency-Check completed."
                        echo "========================================"
                    """
                }
            }

            post {
                always {
                    archiveArtifacts artifacts: 'dependency-check-report/*',
                        allowEmptyArchive: true
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
                    echo "========================================"
                    echo "Building Backend Image"
                    echo "========================================"

                    docker build \
                        -t $BACKEND_IMAGE:$BUILD_NUMBER \
                        ./app

                    docker tag \
                        $BACKEND_IMAGE:$BUILD_NUMBER \
                        $BACKEND_IMAGE:latest


                    echo "========================================"
                    echo "Building Frontend Image"
                    echo "========================================"

                    docker build \
                        -t $FRONTEND_IMAGE:$BUILD_NUMBER \
                        ./frontend

                    docker tag \
                        $FRONTEND_IMAGE:$BUILD_NUMBER \
                        $FRONTEND_IMAGE:latest


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

                        docker push \
                            $BACKEND_IMAGE:$BUILD_NUMBER

                        docker push \
                            $BACKEND_IMAGE:latest


                        echo "Pushing frontend image..."

                        docker push \
                            $FRONTEND_IMAGE:$BUILD_NUMBER

                        docker push \
                            $FRONTEND_IMAGE:latest


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
            echo "OWASP: PASSED"
            echo "Build: PASSED"
            echo "Trivy: PASSED"
            echo "Docker Hub: PUSHED"
            echo "========================================"
        }

        failure {
            echo "========================================"
            echo "DevSecOps Pipeline FAILED"
            echo "========================================"
            echo "Check the failed stage above."
            echo "========================================"
        }
    }
}
