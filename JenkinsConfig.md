# Jenkin setup:

## Setting Up the Environment:

## setup with docker:
- 1. Run Jenkins in Docker:
    - you will need to bind the Docker socker to allow Jenkins to interact with the host Docker

    ```
    docker run -d --name jenkins -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock --user root jenkins/jenkins:lts
    ```

- 2. Unlock Jenkins:
    - Open your web browser and go to http://localhost:8080.
    - Access to the container:
    ```
    docker exec -it jenkins bash
    ```
    - Run apt-get update:

    ```
    apt-get update
    ```
    - install nano
    ```
    apt-get install nano
    ```
    - find secret key:
    ```
    nano /var/jenkins_home/secrets/initialAdminPassword
    ```
    - copy the key and Enter the key in the Jenkins interface.
- 3. Install Docker CLI:
    ```
    apt-get install -y docker.io
    ```
    - verify docker installation:
    ```
    docker --version
    ```
- 4. add jenkins User to Docker Group
    ```
    groupadd docker
    usermod -aG docker jenkins
    ```
- 5. install docker-compose
    ```
    curl -L "https://github.com/docker/compose/releases/download/$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep tag_name | cut -d '"' -f 4)/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    ```

    - verify installation:
    ```
    docker-compose --version
    ```

- 5. Restart jenkins

    ```
    docker restart jenkins
    ```

- Open your web browser and go to http://localhost:8080. and Skip to "Jenkins Step up"

## Setup in Window or Linux
### setup from COMP course:
- 1. Install Prerequisites:
    - Jenkins: Install Jenkins from https://www.jenkins.io/download/.
    - Java: Ensure you have Java JDK installed. Verify using:
    ```
    Java -version
    ```
    - Docker: https://docs.docker.com/desktop/setup/install/windows-install/

- 2. Start Jenkins:
    - Launch Jenkins on your local machine using .war file:
    ```
    java -jar jenkins.war
    ```
    - As a service(Linux):
    ```
    sudo systemctl start jenkins
    ```

- 3. Access Jenkins Web Interface
    - Open your web browser and go to http://localhost:8080.
- 4. Unlock Jenkins

    - During the initial startup, Jenkins will ask for an admin password.

    -  The password is located in:

        - Windows: ```C:\Program Files\Jenkins\secrets\initialAdminPassword```
        - macOS/Linux: ```/Users/yourusername/.jenkins/secrets/initialAdminPassword```
    - Enter the password in the Jenkins interface.


### Jenkins Step up:

- 1. Install Suggested Plugins
    - Choose Install suggested plugins when prompted.

- 2.  Create an Admin User
    - Fill in the required fields to create your admin user.

- 3. Install Necessary Plugins:
    - Docker Pipeline:
        - Search for Docker Pipeline Plugin and install it.
- 4. Create a New Jenkins Job
    - Create a New Jenkins Job From Jenkins dashboard
    - Config the Job:
        - Name: Picking_Up_Steam_Build
        - Select: PipeLine 

    - Configure Source Code Management
        - Go to PipeLine Script from SCM
        - SCM: Select Git
            - Repository URL: https://github.com/docmcstuffins33/COMP_7082_Group8.git
            - Add Credentials with your Username: [you git username] and password: [personal access token]
            - change Branch Specifier to [main] or [your working branch]
            - Script Path is Jenkinsfile
        - Configure Poll SCM:
            ```
            H/5 * * * *
            ```

- 5. Add Environment variable
    - Dashboard -> Manage Jenkins -> System
    - Scroll Down to Environment variables
    - add all necessary Environment variable:
    ```
    FIREBASE_API_KEY: [Your Firebase API Key]
    FIREBASE_APP_ID: [Your FireBase App ID]
    FIREBASE_AUTH_DOMAIN: [Your Auth Domain]
    FIREBASE_MESSANGING_SENDER_ID: [Your Messanging ID]
    FIREBASE_PROJECT_ID: [Your Project ID]
    FIREBASE_STORAGE_BUCKET: [Your Storage Bucket]

    PORT: 8000
    REACT_APP_PORT: 3000

    SERVER_URL: localhost
    STEAM_API_KEY: [Your Steam API Key]

    STEAM_USER_ID: [your steam user id for testing]
    ```

- 6. Go the Project and Click on Build Now
