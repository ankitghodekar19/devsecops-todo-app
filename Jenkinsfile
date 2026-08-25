pipeline {

    agent any

    triggers {
        githubPush()
    }

    environment {
        BACKEND_IMAGE  = "ankitghodekar/devsecops-api"
        FRONTEND_IMAGE = "ankitghodekar/devsecops-frontend"
    }

    stages {

        stage('Checkout') {
            steps {
                git(
                    branch: 'main',
                    credentialsId: 'github-credentials',
                    url: 'https://github.com/ankitghodekar19/devsecops-todo-app.git'
                )
            }
        }


        stage('Check Trigger') {
            steps {
                script {
                    def lastCommitMessage = sh(
                        script: 'git log -1 --pretty=%B',
                        returnStdout: true
                    ).trim()

                    echo "Latest commit: ${lastCommitMessage}"

                    if (lastCommitMessage.startsWith('Update images to build')) {
                        echo "Jenkins GitOps commit detected."
                        echo "Skipping this pipeline to prevent webhook loop."

                        currentBuild.result = 'NOT_BUILT'
                        currentBuild.description = 'Skipped Jenkins GitOps commit'
                        error('Jenkins GitOps commit - skipping pipeline')
                    }
                }
            }
        }


        stage('Backend Test') {
            steps {
                dir('app') {
                    sh '''
                        echo "Running backend tests..."

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
                            echo "Running SonarQube analysis..."

                            ${scannerHome}/bin/sonar-scanner
                        """
                    }
                }
            }
        }


        stage('SonarQube Quality Gate') {
            steps {

                timeout(time: 5, unit: 'MINUTES') {

                    waitForQualityGate abortPipeline: true
                }
            }
        }


        stage('OWASP Dependency-Check') {
            steps {
                script {

                    def dependencyCheckHome = tool 'Dependency-Check'

                    sh """
                        echo "Running OWASP Dependency-Check..."

                        rm -rf dependency-check-report

                        mkdir -p dependency-check-report

                        ${dependencyCheckHome}/bin/dependency-check.sh \
                            --project "DevSecOps Todo App" \
                            --scan ./app \
                            --format HTML \
                            --format XML \
                            --out dependency-check-report \
                            --failOnCVSS 7 \
                            --disableYarnAudit

                        echo "OWASP Dependency-Check completed"
                    """
                }
            }

            post {
                always {

                    archiveArtifacts(
                        artifacts: 'dependency-check-report/*',
                        allowEmptyArchive: true
                    )
                }
            }
        }


        stage('Frontend Build') {
            steps {

                dir('frontend') {

                    sh '''
                        echo "Building frontend..."

                        npm install
                        npm run build

                        echo "Frontend build completed"
                    '''
                }
            }
        }


        stage('Docker Build') {
            steps {

                sh '''
                    echo "================================"
                    echo "Building Backend Docker Image"
                    echo "================================"

                    docker build \
                        -t $BACKEND_IMAGE:$BUILD_NUMBER \
                        ./app


                    docker tag \
                        $BACKEND_IMAGE:$BUILD_NUMBER \
                        $BACKEND_IMAGE:latest


                    echo "================================"
                    echo "Building Frontend Docker Image"
                    echo "================================"

                    docker build \
                        -t $FRONTEND_IMAGE:$BUILD_NUMBER \
                        ./frontend


                    docker tag \
                        $FRONTEND_IMAGE:$BUILD_NUMBER \
                        $FRONTEND_IMAGE:latest


                    echo "Docker build completed"
                '''
            }
        }


        stage('Trivy Security Scan') {
            steps {

                sh '''
                    echo "================================"
                    echo "Trivy Backend Scan"
                    echo "================================"

                    trivy image \
                        --severity HIGH,CRITICAL \
                        --exit-code 1 \
                        --no-progress \
                        $BACKEND_IMAGE:$BUILD_NUMBER


                    echo "================================"
                    echo "Trivy Frontend Scan"
                    echo "================================"

                    trivy image \
                        --severity HIGH,CRITICAL \
                        --exit-code 1 \
                        --no-progress \
                        $FRONTEND_IMAGE:$BUILD_NUMBER


                    echo "Trivy security scan completed"
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
                        echo "================================"
                        echo "Docker Hub Login"
                        echo "================================"

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

                        echo "Docker Hub push completed"
                    '''
                }
            }
        }


        stage('Update GitOps Manifests') {
            steps {

                withCredentials([
                    usernamePassword(
                        credentialsId: 'github-credentials',
                        usernameVariable: 'GIT_USERNAME',
                        passwordVariable: 'GIT_TOKEN'
                    )
                ]) {

                    sh '''
                        echo "================================"
                        echo "Updating GitOps Manifests"
                        echo "================================"


                        sed -i \
                            "s|ankitghodekar/devsecops-api:.*|ankitghodekar/devsecops-api:$BUILD_NUMBER|" \
                            gitops/backend-deployment.yaml


                        sed -i \
                            "s|ankitghodekar/devsecops-frontend:.*|ankitghodekar/devsecops-frontend:$BUILD_NUMBER|" \
                            gitops/frontend-deployment.yaml


                        echo ""
                        echo "Backend image:"
                        grep "image:" gitops/backend-deployment.yaml


                        echo ""
                        echo "Frontend image:"
                        grep "image:" gitops/frontend-deployment.yaml


                        git config user.name "Jenkins"
                        git config user.email "jenkins@localhost"


                        git add \
                            gitops/backend-deployment.yaml \
                            gitops/frontend-deployment.yaml


                        git commit \
                            -m "Update images to build $BUILD_NUMBER" || true


                        git remote set-url origin \
                            https://${GIT_USERNAME}:${GIT_TOKEN}@github.com/ankitghodekar19/devsecops-todo-app.git


                        git push origin main


                        echo ""
                        echo "GitOps update completed"
                    '''
                }
            }
        }
    }


    post {

        success {

            echo """
            ==============================
            DevSecOps Pipeline SUCCESS
            ==============================
            Tests: PASSED
            SonarQube: PASSED
            OWASP: PASSED
            Docker: PASSED
            Trivy: PASSED
            DockerHub: PUSHED
            GitOps: UPDATED
            ==============================
            """
        }


        failure {

            echo """
            ==============================
            DevSecOps Pipeline FAILED
            ==============================
            Check logs
            ==============================
            """
        }
    }
}
