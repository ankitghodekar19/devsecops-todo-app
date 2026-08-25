pipeline {

    agent any

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
                            echo "Running SonarQube analysis..."

                            ${scannerHome}/bin/sonar-scanner
                        """
                    }
                }
            }
        }


        stage('SonarQube Quality Gate') {
            steps {
                timeout(time:5, unit:'MINUTES') {
                    waitForQualityGate abortPipeline:true
                }
            }
        }


        stage('OWASP Dependency-Check') {

            steps {

                script {

                    def dependencyCheckHome = tool 'Dependency-Check'

                    sh """

                    mkdir -p dependency-check-report


                    ${dependencyCheckHome}/bin/dependency-check.sh \
                    --project "DevSecOps Todo App" \
                    --scan ./app \
                    --format HTML \
                    --format XML \
                    --out dependency-check-report \
                    --failOnCVSS 7


                    """
                }
            }

            post {
                always {
                    archiveArtifacts artifacts:'dependency-check-report/*',
                    allowEmptyArchive:true
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

                docker build \
                -t $BACKEND_IMAGE:$BUILD_NUMBER \
                ./app


                docker tag \
                $BACKEND_IMAGE:$BUILD_NUMBER \
                $BACKEND_IMAGE:latest



                docker build \
                -t $FRONTEND_IMAGE:$BUILD_NUMBER \
                ./frontend


                docker tag \
                $FRONTEND_IMAGE:$BUILD_NUMBER \
                $FRONTEND_IMAGE:latest


                '''
            }
        }



        stage('Trivy Security Scan') {

            steps {

                sh '''

                trivy image \
                --severity HIGH,CRITICAL \
                --exit-code 1 \
                --no-progress \
                $BACKEND_IMAGE:$BUILD_NUMBER



                trivy image \
                --severity HIGH,CRITICAL \
                --exit-code 1 \
                --no-progress \
                $FRONTEND_IMAGE:$BUILD_NUMBER


                '''
            }
        }



        stage('Push to Docker Hub') {

            steps {

                withCredentials([
                    usernamePassword(
                        credentialsId:'dockerhub-credentials',
                        usernameVariable:'DOCKER_USERNAME',
                        passwordVariable:'DOCKER_PASSWORD'
                    )
                ]) {


                sh '''

                echo "$DOCKER_PASSWORD" | docker login \
                -u "$DOCKER_USERNAME" \
                --password-stdin



                docker push $BACKEND_IMAGE:$BUILD_NUMBER

                docker push $BACKEND_IMAGE:latest



                docker push $FRONTEND_IMAGE:$BUILD_NUMBER

                docker push $FRONTEND_IMAGE:latest



                docker logout


                '''
                }
            }
        }



        stage('Update GitOps Manifests') {

            steps {


            withCredentials([
                usernamePassword(
                    credentialsId:'github-credentials',
                    usernameVariable:'GIT_USERNAME',
                    passwordVariable:'GIT_TOKEN'
                )
            ]) {


            sh '''

            echo "Updating GitOps images"



            sed -i \
            "s|ankitghodekar/devsecops-api:.*|ankitghodekar/devsecops-api:$BUILD_NUMBER|" \
            gitops/backend-deployment.yaml



            sed -i \
            "s|ankitghodekar/devsecops-frontend:.*|ankitghodekar/devsecops-frontend:$BUILD_NUMBER|" \
            gitops/frontend-deployment.yaml



            grep image: gitops/backend-deployment.yaml

            grep image: gitops/frontend-deployment.yaml



            git config user.name "Jenkins"

            git config user.email "jenkins@localhost"



            git add gitops/backend-deployment.yaml \
            gitops/frontend-deployment.yaml



            git commit \
            -m "Update images to build $BUILD_NUMBER" || true



            git remote set-url origin \
            https://${GIT_USERNAME}:${GIT_TOKEN}@github.com/ankitghodekar19/devsecops-todo-app.git



            git push origin main



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
