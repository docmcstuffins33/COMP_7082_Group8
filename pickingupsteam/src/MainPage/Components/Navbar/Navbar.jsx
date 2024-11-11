import React, { useEffect, useState } from 'react';
import './Navbar.css'; // Optional: for styling
import { Link, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import {useAuth} from '../../../Context/AuthContext'



function Navbar() {
    //storing the credit, should be dynamic or stored in a database
    const {user, isAuthenticated} = useAuth();
    const [credit, setCredit] = useState(0);

    //handle the redirect to previous page
    const location = useLocation();
    const handleLoginClick = () => {
        sessionStorage.setItem("previousPage", location.pathname);
    };

    useEffect(() => {
        if(user){
            console.log("Current Credit: " + user.Points);
            setCredit(user.Points);
        }
    }, [user]);

    // Determine background style
    const navbarStyle = {
        backgroundImage: isAuthenticated && user.Inventory?.Banners?.length > 0 
            ? `url(${user.Inventory.Banners[0].img})` 
            : 'linear-gradient(to bottom right, #446996, #1b2838',
    };
    return (
        <nav className="app__navbar" style={navbarStyle}>
        <Link to="/home">
            <h1 className="app__navbar-logo">Picking Up Steam</h1>
        </Link>
        
        <ul className='app__navbar-links'>
            {isAuthenticated? 
                <>
                    <Link to="/store" className="app__linkButton">
                        <img className="points_img" src="https://cdn-icons-png.flaticon.com/512/546/546580.png" alt='Points:'></img> {credit}
                    </Link>
                    <Link to="/profile" className="app__linkButton">
                        Profile
                    </Link>
                    <Link to="/signOut" className="app__linkButton" onClick={handleLoginClick}>
                        Sign out
                    </Link>
                </>
                :
                <>
                    <Link to="/login" className="app__linkButton" onClick={handleLoginClick}>
                        Login
                    </Link>
                </>
            }

        </ul>
        </nav>
    );
};

export default Navbar;