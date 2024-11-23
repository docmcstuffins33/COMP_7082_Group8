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

        stage('Build Docker Images') {
            steps {
                script {
                    docker.build("${FRONTEND_IMAGE}", "./pickingupsteam")
                    docker.build("${BACKEND_IMAGE}", "./server")
                }
            }
        }

        // stage('Run Tests') {
        //     steps {
        //         script {
        //             docker.image("${BACKEND_IMAGE}").inside {
        //                 sh 'npm test'
        //             }
        //             docker.image("${FRONTEND_IMAGE}").inside {
        //                 sh 'npm test'
        //             }
        //         }
        //     }
        // }

        stage('Deploy Containers') {
            steps {
                sh 'docker-compose up -d'
            }
        }
    }

    post {
        always {
            sh 'docker-compose down'
        }
        success {
            echo 'Build and deployment successful!'
        }
        failure {
            echo 'Build failed.'
        }
    }
}