const express = require('express');
const app = express();
const axios = require('axios');
const cors = require("cors")

require('dotenv').config();
const { API_KEY } = require('./config'); 

STEAM_API_KEY = process.env.STEAM_API_KEY;

app.use(cors({
    origin:"*",
    methods:['GET']
}))

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});

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
        console.log(STEAM_API_KEY)
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