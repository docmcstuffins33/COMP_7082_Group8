
//---------------------Set up express server----------------------
const express = require('express');
const app = express();
const axios = require('axios');
const cors = require("cors")

require('dotenv').config()

//Cors policy! We love it! (This caused significant headache before I remembered that setting the cors policy is important.)
app.use(cors({
    origin:"*",
    methods:['GET']
}))

var bodyParser = require('body-parser')
app.use(bodyParser.json());
//Grab the requested port from .env, or just default to 8080 if none is specified.
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});
//---------------------End of express server setup----------------------

//This is our unique steam API key, from the .env file.
const STEAM_API_KEY = process.env.STEAM_API_KEY;

/*Gets the list of steam games from a given SteamID. Returns the list if it is found, or an error 500 if it could not properly fetch the data.*/
app.get('/api/gamesByUser/:uid', async (req, res) => {
    console.log("Recieved Request.")
    try {
        const uid = req.params.uid;
        const response = await axios.get('http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=' + STEAM_API_KEY + '&steamid=' + uid + '&format=json&include_appinfo=true&include_played_free_games=true');
        const apps = response.data.response.games;
        const limitedApps = apps.filter(x => x.name);
        res.send({applist: {apps: limitedApps}});
    } catch (error) {
        console.error('Error fetching data from Steam API:', error);
        res.status(500).send('Error fetching data from Steam API');
        console.log(req.params.uid);
        console.log(STEAM_API_KEY);
    }
});

/*Gets the list of steam achievements on a game for a user from a given SteamID and AppID. Returns the list if it is found, error 400 if a param is missing, and error 429 if the rate limit has been exceeded.*/
app.get('/api/achievementsByAppid/:uid/:appid', async (req, res) => {
    console.log("Received Request.");
    try {
        const uid = req.params.uid;
        const appid = req.params.appid;

        if (!uid || !appid) {
            return res.status(400).send({ error: 'SteamID or AppID is missing' });
        }

        //console.log('Requesting achievements from:', `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${appid}&key=${STEAM_API_KEY}&steamid=${uid}`);

        const response = await axios.get(`https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${appid}&key=${STEAM_API_KEY}&steamid=${uid}`);
        const achievements = response?.data?.playerstats?.achievements?.map(achievement => ({
            name: achievement.apiname,
            achieved: achievement.achieved
        })) || [];

        res.send({ applist: { apps: achievements } });
    } catch (error) {
        if (error.response?.status === 429) {
            console.error('Rate limit exceeded');
        } else {
            console.error('Error fetching achievements:', error.message);
        }
        res.send({ applist: { apps: [] } });
    }
});

/*Gets the steam achievement schema for a game from its AppID. Returns the list if it is found, or an error code if it could not properly fetch the data.*/
app.get('/api/achievementSchemaByAppid/:appid', async (req, res) => {
    console.log("Received Request.");
    try {
        const appid = req.params.appid;

        if (!appid || isNaN(appid)) {
            return res.status(400).send({ error: 'Invalid AppID' });
        }

        //console.log('Requesting schema for appid:', appid, 'URL:', `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${STEAM_API_KEY}&appid=${appid}`);

        const response = await axios.get(`https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${STEAM_API_KEY}&appid=${appid}`);
        const achievements = response?.data?.game?.availableGameStats?.achievements || [];

        res.send({ applist: { apps: achievements } });
    } catch (error) {
        if (error.response) {
            console.error(`Steam API error for appid:`, error.response.status, error.response.statusText);
            console.error("Full response data:", error.response.data);
        } else {
            console.error(`Error fetching schema for appid:`, error.message);
        }
        res.status(500).send({ applist: { apps: [] } });
    }
});

/*Gets the profile status for a steam account from the steam id. Returns the status if it is found, or an error code if it could not properly fetch the data.*/
app.get('/api/getProfileVisibility/:uid', async (req, res) => {
    console.log("Recieved Request.");
    try {
        const uid = req.params.uid;

        if (!uid || !/^\d+$/.test(uid)) {
            return res.status(400).send({ error: 'Invalid Steam ID' });
        }

        //console.log('Requesting profile visibility for:', uid, 'URL:', apiUrl);

        const apiUrl = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${STEAM_API_KEY}&steamids=${uid}`;
        const response = await axios.get(apiUrl);
        const players = response?.data?.response?.players || [];
        let profile = -1;

        if (players.length === 1) {
            profile = players[0].communityvisibilitystate || -1;
        }

        res.send({ profileState: profile });
    } catch (error) {
        if (error.response) {
            console.error(`Steam API error for steam id:`, error.response.status, error.response.statusText);
            console.error("Full response data:", error.response.data);
        } else {
            console.error(`Error fetching profile for steam id:`, error.message);
        }
        res.status(500).send({ applist: { apps: [] } });
    }
});

/*SteamSpy api route, should hypothetically be fetching data including the median playtime. 
Currently, this API is unavailable, but I have left this code in, just in case the API developer ever gets back to me about un-deprecating it.
Generally though, this route goes unused./*/
app.get('/api/steamSpy/:appid', async (req, res) => {
    console.log("Recieved Request.")
    try {
        const appid = req.params.appid;
        const response = await axios.get('http://steamspy.com/api.php?request=appdetails&appid=' + appid);
        res.send(response.data);
    } catch (error) {
        console.error('Error fetching data from Steam API:', error);
        res.status(500).send('Error fetching data from Steam API');
        console.log(req.params.appid);
        console.log(STEAM_API_KEY);
    }
});



/*Accesses the IGDB stats for a game given its name. Returns game data on a success and error 500 on a failure.*/
app.get('/api/IGDB/:name', async (req, res) => {
    console.log("Recieved Request.")
    try {
        await checkAccessToken();
        const response = await axios.post('https://api.igdb.com/v4/games', "search \"" + req.params.name + "\"; fields *;", {
            headers: {
                'Client-ID': TWITCH_CLIENT_ID,
                'Authorization': 'Bearer ' + igdbAccessToken  
            }
          })
        res.send(response.data);
    } catch (error) {
        console.error('Error fetching data from IGDB:', error);
        res.status(500).send('Error fetching data from IGDB');
        console.log(TWITCH_CLIENT_ID)
        console.log(TWITCH_CLIENT_SECRET)
    }
});

/*Test route to ensure that the SteamAPI is functioning properly. Returns the first 100 games in Steam's database.*/
app.get('/api/applist', async (req, res) => {
    console.log("Recieved Request.")
    try {
        const response = await axios.get('http://api.steampowered.com/ISteamApps/GetAppList/v0002/?format=json');
        const apps = response.data.applist.apps;
        //Currently, this only sends the first 100 apps. This is mostly jsut to test.
        //Pagination would be nice to add later.
        const namedApps = apps.filter(x => x.name);
        const limitedApps = namedApps.slice(0,100);
        res.send({applist: {apps: limitedApps}});
    } catch (error) {
        console.error('Error fetching data from Steam API:', error);
        res.status(500).send('Error fetching data from Steam API');
    }
});
