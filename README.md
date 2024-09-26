# COMP_7082_Group8

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
REACT_APP_STEAM_API_KEY=BB99999999999999
REACT_APP_STEAM_USER_ID=99999999999999
REACT_APP_PORT=3000

```

### /Server/.env

STEAM_API_KEY=BB99999999999999
STEAM_USER_ID=99999999999999
PORT=3000

### /.env

REACT_APP_PORT=3000
PORT=8080
