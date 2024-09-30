import {useState, useEffect} from 'react';
import { BrowserRouter , Routes, Route } from 'react-router-dom';
import './index.css'
import axios from 'axios';



import { MainRandomGamePage, Navbar, Store, LoginPage, CreditPage} from './MainPage/index.js';

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
                    </Routes>
                </BrowserRouter>
            </div>

        )
}
export default App;
