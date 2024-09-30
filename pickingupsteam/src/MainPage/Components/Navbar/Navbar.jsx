import React, { useEffect } from 'react';
import './Navbar.css'; // Optional: for styling
import { Link } from "react-router-dom";



function Navbar() {
    //storing the credit, should be dynamic or stored in a database
    const [currentCredit, setCurrentCredit] = React.useState(300);

    useEffect(() => {
        console.log("Current Credit: " + currentCredit);    
    }, [currentCredit]);
    return (
        <nav className="app__navbar">
        <Link to="/home">
            <h2 className="app__navbar-logo">Picking Up Steam</h2>
        </Link>
        


        <ul className='app__navbar-links'>
            <Link to="/store" className="app__linkButton">
                Store
            </Link>
            <Link to="/credit" className="app__linkButton">
                Credit: {currentCredit}
            </Link>
            <Link to="/login" className="app__linkButton">
                Login
            </Link>
        </ul>
        {
        
        /* <Link to="/">Home</Link>
        <Link to="/store">Store</Link>
        <Link to="/">Profile</Link>
        <Link to="/">Quests</Link> */}
        

        </nav>
    );
};

export default Navbar;