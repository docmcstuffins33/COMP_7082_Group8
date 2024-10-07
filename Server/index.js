
//---------------------setup express server----------------------
const express = require('express');
const app = express();
const axios = require('axios');
const cors = require("cors")

require('dotenv').config()

app.use(cors({
    origin:"*",
    methods:['GET']
}))

//handle JSON requests
var bodyParser = require('body-parser')
app.use(bodyParser.json());
// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});
//---------------------setup express server----------------------

const STEAM_API_KEY = process.env.STEAM_API_KEY;
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;

let igdbAccessToken = null;
let igdbTokenExpiryTime = null;

async function getAccessToken(){
    try {
        const response = await axios.post('https://id.twitch.tv/oauth2/token?client_id=' + TWITCH_CLIENT_ID + '&client_secret=' + TWITCH_CLIENT_SECRET + '&grant_type=client_credentials');
        igdbAccessToken = response.data.access_token;
        const expiresIn = response.data.expires_in;

        // Calculate expiry time in milliseconds
        igdbTokenExpiryTime = Date.now() + (expiresIn - 300) * 1000; // Refresh 5 minutes before expiration

        console.log('Access token fetched:', igdbAccessToken);
    } catch (error) {
        console.error('Error fetching access token:', error);
    }
}

async function checkAccessToken() {
    if (!igdbAccessToken || Date.now() >= igdbTokenExpiryTime) {
        await getAccessToken();
    }
}

getAccessToken();

//76561198290514792 is will's steam id. You can use this to test if you want
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

//SteamSpy api route, should hypothetically be fetching data including the median playtime.
//Currently the api seems to always return 0? I've reached out to the API developer and am awaiting a response.
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



//This route can get some extra stats about a game. Might be unnecessary, but was implemented in hopes that it would show playtime.
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
