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
    const [threeAppids, setThreeAppids] = useState([]);

    const [boxVisbility, setBoxVisibility] = useState([true, true, true])

    const { addCreditToUser } = useFirebaseHook();

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
        try {
            const response = await axios.get(`http://${serverURL}:${serverPort}/api/achievementsByAppid/${user.SteamID}/${appid}`);
            const gameAchievements = response.data.applist.apps;

            return gameAchievements ? gameAchievements.filter(achievement => achievement.achieved === 0) : [];
        } catch (error) {
            console.error("Error fetching achievements for appid", appid, error);
            return [];
        }
    };

    const GetRandomAchievements = async() => {
        const randomAchievements = new Map();

        for (const [appid, gameAchievements] of achievements) {
            const randomIndex = Math.floor(Math.random() * gameAchievements.length);
            randomAchievements.set(appid, GetAchievementSchema(appid, gameAchievements[randomIndex].name));
        }

        setThreeAchievements(randomAchievements);
    };

    const GetAchievementSchema = async(appid, achievementName) => {
        try {
            const response = await axios.get(`http://${serverURL}:${serverPort}/api/achievementSchemaByAppid/${appid}`);
            const achievements = response.data.applist.apps;
            const achievement = achievements.filter(x => x.name === achievementName);

            return achievement;
        } catch (error) {
            console.error("Error fetching achievement schema", appid, achievementName, error.message);
            return [];
        }
    };

    const GetThreeGames = useCallback(async() => {
        if (!user) return;

        let allGames = await GetGameByUserID(user.SteamID, serverURL, serverPort);
        const under120Minutes = allGames.filter(game => game.playtime_forever <= 120);
        const shuffledGames = GenerateRandomShuffle(under120Minutes);

        console.log(under120Minutes);
        console.log(shuffledGames);

        const gamesWithAchievements = [];
        for (const game of shuffledGames) {
            const unachieved = await GetGameAchievements(game.appid);

            if(unachieved.length > 0) {
                gamesWithAchievements.push(game);
            }

            if(gamesWithAchievements.length === 3) break;
        }

        const achievementMap = new Map();
        for (const game of gamesWithAchievements) {
            const unachieved = await GetGameAchievements(game);

            achievementMap.set(game, unachieved);
        }

        setThreeAppids(gamesWithAchievements);
        setAchievements(achievementMap);

        GetRandomAchievements();
    }, [user, serverURL, serverPort, GenerateRandomShuffle, GetGameAchievements, GetRandomAchievements]);

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
        if (isAuthenticated) {
            try {
                GetThreeGames();
            } catch (error) {
                console.error("Error fetching achievements: " + error);
            } finally {
                setLoading(false);
            }
        }
    }, [isAuthenticated, user]);

    return (
        <div>
            {isAuthenticated && (
                <button
                    className={`toggle-button ${isOpen ? 'button-open' : 'button-closed'}`}
                    onClick={togglePanel}
                >
                    {isOpen ? '←' : '→'}
                </button>
            )}

            <div className={`side-panel ${isOpen ? 'open' : 'closed'}`}>
                <h2 className="panel-title">Rewards</h2>
                {[...threeAchievements.entries()].map(([appid, achievement], index) => (
                    boxVisbility[index] && (
                        <div className="achievement-box" key={appid}>
                            <img src={achievement.icon} alt={achievement.displayName} className="achievement-image"/>
                            <span className="achievement-text">{achievement.displayName}</span>
                            <span className="achievement-number">{achievement.points || 100} Points</span>
                            <div className="button-group">
                                <button className="claim-button" onClick={() => claimReward(index, achievement.points || 100)}>Claim</button>
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
