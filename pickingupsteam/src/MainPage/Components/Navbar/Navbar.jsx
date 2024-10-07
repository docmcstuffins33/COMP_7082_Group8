import React, { useEffect, useState } from 'react';
import './Navbar.css'; // Optional: for styling
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';




function Navbar() {
    //storing the credit, should be dynamic or stored in a database
    const {user, isAuthenticated} = useSelector(state => state.auth);
    const [credit, setCredit] = useState(0);
    useEffect(() => {
        if(user){
            console.log("Current Credit: " + user.Points);
            setCredit(user.Points);
        }
    }, [user]);
    return (
        <nav className="app__navbar">
        <Link to="/home">
            <h1 className="app__navbar-logo">Picking Up Steam</h1>
        </Link>
        
        <ul className='app__navbar-links'>
            <Link to="/store" className="app__linkButton">
                Store
            </Link>
            <Link to="/credit" className="app__linkButton">
                Credit: {credit}
            </Link>
            {isAuthenticated? 
                <>
                    <Link to="/profile" className="app__linkButton">
                        Profile
                    </Link>
                    <Link to="/signOut" className="app__linkButton">
                        Sign out
                    </Link>
                </>
                :
                <>
                    <Link to="/login" className="app__linkButton">
                        Login
                    </Link>
                </>
            }

        </ul>
        </nav>
    );
};

export default Navbar;