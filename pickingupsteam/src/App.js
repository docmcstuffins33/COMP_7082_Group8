import {useState, useEffect} from 'react';
import { BrowserRouter , Routes, Route } from 'react-router-dom';
import './index.css'
import axios from 'axios';



import { MainRandomGamePage, Navbar, Store, LoginPage, CreditPage, ProfilePage, SignoutPage} from './MainPage/index.js';

function App() {
    return (
            <div className="content">
                <BrowserRouter>    
                    <Navbar/>
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

        )
}
export default App;
