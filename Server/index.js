const express = require('express');
const app = express();
const axios = require('axios');
const cors = require("cors")
import { configData } from './config.js'

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