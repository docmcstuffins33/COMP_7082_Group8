pipeline {
    agent any

    environment {
        FRONTEND_IMAGE = "pickingupsteam"
        BACKEND_IMAGE = "server"
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Prepare .env file for frontend') {
            steps {
                sh '''
                cat <<EOF > ./pickingupsteam/.env
                REACT_APP_STEAM_API_KEY=${STEAM_API_KEY}
                REACT_APP_PORT=${REACT_APP_PORT}
                REACT_APP_STEAM_USER_ID=${STEAM_USER_ID}

                REACT_APP_SERVER_URL=${SERVER_URL}
                REACT_APP_SERVER_PORT=${REACT_APP_SERVER_PORT}

                REACT_APP_FIREBASE_API_KEY=${FIREBASE_API_KEY}
                REACT_APP_FIREBASE_AUTH_DOMAIN=${FIREBASE_AUTH_DOMAIN}
                REACT_APP_FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID}
                REACT_APP_FIREBASE_STORAGE_BUCKET=${FIREBASE_STORAGE_BUCKET}
                REACT_APP_FIREBASE_MESSANGING_SENDER_ID=${FIREBASE_MESSANGING_SENDER_ID}
                REACT_APP_FIREBASE_APP_ID=${FIREBASE_APP_ID}
                EOF
                '''
            }
        }
        stage('Prepare .env file for backend') {
            steps {
                sh '''
                cat <<EOF > ./Server/.env
                STEAM_API_KEY=${STEAM_API_KEY}
                PORT=${PORT}
                STEAM_USER_ID=${STEAM_USER_ID}

                FIREBASE_API_KEY=${FIREBASE_API_KEY}
                FIREBASE_AUTH_DOMAIN=${FIREBASE_AUTH_DOMAIN}
                FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID}
                FIREBASE_STORAGE_BUCKET=${FIREBASE_STORAGE_BUCKET}
                FIREBASE_MESSANGING_SENDER_ID=${FIREBASE_MESSANGING_SENDER_ID}
                FIREBASE_APP_ID=${FIREBASE_APP_ID}
                EOF
                '''
            }
        }
        
        stage('Clean Up old build') {
            steps {
                sh 'docker-compose down'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker build -t ${BACKEND_IMAGE} ./Server'
                sh 'docker build -t ${FRONTEND_IMAGE} ./pickingupsteam'
            }
        }
        stage('Run Tests') {
            steps {
                script {
                    docker.image("${FRONTEND_IMAGE}").inside {
                        sh 'cd pickingupsteam && npm install && npm run test'
                    }
                }
            }
        }
        // stage('push Docker Images') {
        //     steps {
        //         sh 'docker push ${FRONTEND_IMAGE}'
        //         sh 'docker push ${BACKEND_IMAGE}'

        stage('Deploy Containers') {
            steps {
                sh 'docker-compose up -d'
            }
        }
    }

    post {
        success {
            echo 'Build and deployment successful!'
        }
        failure {
            echo 'Build failed.'
        }
    }
}