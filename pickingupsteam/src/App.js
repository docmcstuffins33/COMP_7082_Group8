import {useState, useEffect} from 'react';
import { BrowserRouter , Routes, Route } from 'react-router-dom';
import './index.css'
import axios from 'axios';

import { AuthProvider } from './Context/AuthContext.jsx';
import { MainRandomGamePage, Navbar, AchievementsPanel, Store, LoginPage, CreditPage, ProfilePage, SignoutPage} from './MainPage/index.js';

function App() {
    return (
        <AuthProvider>
            <div className="content">
                <BrowserRouter>    
                    <Navbar/>
                    <AchievementsPanel/>
                    <Routes>
                        <Route path="/" element={<MainRandomGamePage />}/>
                        <Route path="/home" element={<MainRandomGamePage />} />
                        <Route path="/store" element={<Store />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/credit" element={<CreditPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/signout" element={<SignoutPage />} />
                    </Routes>
                </BrowserRouter>
            </div>
        </AuthProvider>
        )
}
export default App;
