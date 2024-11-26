import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { GetGameByUserID } from '../../../SteamUtils';
import './AchievementsPanel.css';
import { auth } from '../../../Firebase/Firebase';
import { useFirebaseHook } from '../../../Firebase/FireBaseHook'
import { useAuth } from '../../../Context/AuthContext';
import axios from 'axios';

const AchievementsPanel = () => {
    const [isLoading, setLoading] = useState(true);

    const [isOpen, setIsOpen] = useState(false);

    const { user, isAuthenticated } = useAuth();

    const [serverURL, setServerURL] = useState(process.env.REACT_APP_SERVER_URL);
    const [serverPort, setServerPort] = useState(process.env.REACT_APP_SERVER_PORT);
    
    const [achievements, setAchievements] = useState([]);
    const [threeAchievements, setThreeAchievements] = useState([]);

    const [boxVisbility, setBoxVisibility] = useState([true, true, true])

    const {addCreditToUser, removeCreditFromUser } = useFirebaseHook();
    const [showPanel, setShowPanel] = useState(false);

    const togglePanel = () => {
        setIsOpen(!isOpen);
    };

    const GenerateRandomShuffle = (games) => {
        const shuffledIndices = Array.from({ length: games.length }, (_, i) => i);

        let currIndex = games.length;
        while (currIndex !== 0) {
            let randomIndex = Math.floor(Math.random() * currIndex);
            currIndex--;

            [shuffledIndices[currIndex], shuffledIndices[randomIndex]] = [shuffledIndices[randomIndex], shuffledIndices[currIndex]];
        }

        return shuffledIndices.map(i => games[i]);
    };

    const GetGameAchievements = async(appid) => {
        console.log(serverPort)
        console.log("SETTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT")
        try {
            let response;
            if(!serverPort || serverPort === ""){
                console.log("--------------------Https declared in server URL---------------------");
                // response = await axios.get(`https://${serverURL}/api/achievementsByAppid/${user.SteamID}/${appid}`);
            }
            else{
                // response = await axios.get(`https://${serverURL}:${serverPort}/api/achievementsByAppid/${user.SteamID}/${appid}`);
            }
            const gameAchievements = response.data.applist.apps;

            return gameAchievements ? gameAchievements.filter(achievement => achievement.achieved === 0) : [];
        } catch (error) {
            console.error("Error fetching achievements for appid", appid, error);
            return [];
        }
    };

    const GetRandomAchievements = async () => {
        const randomAchievements = new Map(); // Holds the random achievements by AppID
    
        console.log(achievements);  // Debug: Check the achievements structure
    
        // Iterate over the games in achievements (now assumed to be an array of game data)
        for (const achievementData of achievements) {
            const { appid, achievements: gameAchievements } = achievementData;
    
            // Ensure the game has achievements and they are unachieved
            if (!gameAchievements || gameAchievements.length === 0) {
                console.warn(`No unachieved achievements found for AppID: ${appid}`);
                continue;
            }
    
            // Pick a random achievement from the game's unachieved list
            const randomIndex = Math.floor(Math.random() * gameAchievements.length);
            const randomAchievement = gameAchievements[randomIndex];
    
            // Ensure the random achievement is valid
            if (!randomAchievement || !randomAchievement.name) {
                console.warn(`Invalid achievement at index ${randomIndex} for AppID: ${appid}`);
                continue;
            }
    
            // Fetch schema data for the achievement
            const schema = await GetAchievementSchema(appid, randomAchievement.name);
    
            if (!schema) {
                console.warn(`Schema not found for Achievement: ${randomAchievement.name} in AppID: ${appid}`);
                continue;
            }
    
            // Add the achievement schema to the map for later use
            randomAchievements.set(appid, schema);
        }
    
        console.log("Final Random Achievements:", randomAchievements);
    
        // Set the state with the random achievements map
        setThreeAchievements(randomAchievements);
    };    

    const GetAchievementSchema = async(appid, achievementName) => {
        try {
            let response;
            if(!serverPort || serverPort === ""){
                console.log("--------------------Https declared in server URL---------------------");
                response = await axios.get(`https://${serverURL}/api/achievementSchemaByAppid/${user.SteamID}/${appid}`);
            }
            else{
               response = await axios.get(`https://${serverURL}:${serverPort}/api/achievementSchemaByAppid/${appid}`);
            }
            
            const achievements = response.data.applist.apps;
            const achievement = achievements.find(x => x.name === achievementName) || {};

            return achievement;
        } catch (error) {
            console.error("Error fetching achievement schema", appid, achievementName, error.message);
            return [];
        }
    };

    const GetThreeGames = async () => {
        if (!user) return;
    
        let allGames = await GetGameByUserID(user.SteamID, serverURL, serverPort);
        const under30Minutes = allGames.filter(game => game.playtime_forever <= 30);
        const shuffledGames = GenerateRandomShuffle(under30Minutes);
    
        const gamesWithAchievements = [];
        for (const game of shuffledGames) {
            const unachieved = await GetGameAchievements(game.appid);
    
            if (unachieved.length > 0) {
                gamesWithAchievements.push({
                    appid: game.appid,
                    achievements: unachieved,
                });
            }
    
            if (gamesWithAchievements.length === 3) break;
        }
    
        console.log(gamesWithAchievements);
    
        setAchievements(gamesWithAchievements);
    
        console.log(achievements);
    };
    

    const claimReward = async(boxId, points) => {
        if (isAuthenticated) {
            const authUser = auth.currentUser;
            addCreditToUser(authUser.uid, user, points);
        }

        setBoxVisibility((prevVisibility) => {
            const newVisibility = [...prevVisibility];
            newVisibility[boxId] = false;
            return newVisibility;
        });
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const currentPath = window.location.pathname;
            if (currentPath === '/home') {
                setShowPanel(true);
            } else {
                setShowPanel(false);
            }
        }, 100);
    
        return () => clearInterval(interval);
    }, []);    

    useEffect(() => {
        if (isAuthenticated) {
            try {
                GetThreeGames();
            } catch (error) {
                console.error("Error fetching achievements: " + error);
            }
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if(achievements.length > 0)
        {
            try {
            GetRandomAchievements()
            } catch (error) {
                console.error("Error choosing random achievements: " + error);
            } finally {
                setLoading(false);
            }
        }
    }, [achievements]);

    if (isLoading) {
        <div className="loading">loading</div>
    }

    return (
        <div>
            {isAuthenticated && showPanel && (
                <button
                    className={`toggle-button ${isOpen ? 'button-open' : 'button-closed'}`}
                    onClick={togglePanel}
                >

                    {isOpen ? '←' : '→'}
                </button>
            )}

            <div className={`side-panel ${isOpen ? 'open' : 'closed'}`}>
                <h2 className="panel-title">Achievements</h2>
                {/* Iterate over the entries of the threeAchievements Map */}
                {Array.from(threeAchievements.entries()).map(([appid, schema], index) => (
                    // Check visibility and ensure schema is valid
                    schema && boxVisbility[index] && (
                        <div className="achievement-box" key={appid}>
                            {/* Render achievement icon, use placeholder if not found */}
                            <img
                                src={schema.icon || '/placeholder-icon.png'}
                                alt={schema.displayName || 'Achievement'}
                                className="achievement-image"
                            />
                            <span className="achievement-text">
                                {schema.displayName || 'Unknown Achievement'}
                            </span>
                            <span className="achievement-number">
                                {schema.points || 100} Points
                            </span>
                            <div className="button-group">
                                {/* Claim button with points from schema */}
                                <button
                                    className="claim-button"
                                    onClick={() => claimReward(index, schema.points || 100)}
                                >
                                    Claim
                                </button>
                                <button className="refresh-button">Refresh</button>
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
};

export default AchievementsPanel;
