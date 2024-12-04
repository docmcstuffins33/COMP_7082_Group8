# Picking Up Steam

# Docker Compose

To build the project
```
docker-compose up --build
```

To run the project with docker:
```
docker-compose up -d
```

To restart the docker:
```
docker-compose down -d
docker-compose up -d
```

## Env File
### /pickingupsteam/.env

```
REACT_APP_FIREBASE_API_KEY=A9999999999999999999
REACT_APP_FIREBASE_AUTH_DOMAIN=pickingupsteam-8fd85.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=pickingupsteam-8fd85
REACT_APP_FIREBASE_STORAGE_BUCKET=pickingupsteam-8fd85.appspot.com
REACT_APP_FIREBASE_MESSANGING_SENDER_ID=294197266919
REACT_APP_FIREBASE_APP_ID=1:294197266919:web:9f7d233f7724ebc6c01542

REACT_APP_STEAM_API_KEY=BB99999999999999
REACT_APP_STEAM_USER_ID=99999999999999
REACT_APP_PORT=3000

REACT_APP_SERVER_URL=localhost
REACT_APP_SERVER_PORT=8080
```

### /Server/.env
```
STEAM_API_KEY=BB99999999999999
STEAM_USER_ID=99999999999999
PORT=8080
TWITCH_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXX
TWITCH_CLIENT_SECRET=XXXXXXXXXXXXXXXXXXXX

```
### /.env

```
REACT_APP_PORT=3000
PORT=8080
```

## Startup

In both the server and pickingupsteam subfolders, start both parts with:
```
npm start
```
Make sure to start with the server before the pickingupsteam

## CI/CD
refer to the file [JenkinsConfig](JenkinsConfig.md) for CI/CD setup 

## Main File Structure
>pickingupsteam
    >src
        >Context (Contains Auth State)
        >Firebase (Contains Firebase hooks and logic)
        >MainPage (Contains all pages and component logic for website)
        >Redux (Contains states for store info)
        >SteamUtils (Contains SteamAPI hooks)
        >Test (Contains tests for Jenkins to run)
        -App.js

>server
    -index.js