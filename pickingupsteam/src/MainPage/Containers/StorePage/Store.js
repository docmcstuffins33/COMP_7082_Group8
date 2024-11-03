import React, { useEffect, useState } from 'react';
import { Outlet, Link } from "react-router-dom";
import './Store.css';
import { fetchAllIcons, fetchAllBackgrounds, getImage } from '../../../Firebase/FirebaseUtils';
import Modal from 'react-modal';
import zIndex from '@mui/material/styles/zIndex';

import { useSelector } from 'react-redux';
import { useFirebaseHook } from '../../../Firebase/FireBaseHook';
import ProfileDecorations from './Component/ProfileDecorations';
import ProfileThemes from './Component/ProfileThemes';
import PurchaseModel from './Component/PurchaseModel';

import { useDispatch } from 'react-redux';
import { fetchIcon } from '../../../Redux/Inventory/IconSlice';


function Store() {
    //For now, just making dummy arrays of hypothetical decorations will work.
    //Eventually, these should probably be loaded dynamically from a database, either local or online
    const [profileDecorations, setProfileDecorations] = useState([]);
    const [profileThemes, setProfileThemes] = useState([]);
    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [modalIsOpen, setIsOpen] = useState(false);

    //Load icons and backgrounds into Redux from the firebase hooks

    const {getIcon, getBackground} = useFirebaseHook();
    const {icons} = useSelector(state => state.icon);
    const {backgrounds} = useSelector(state => state.background);
    
    useEffect(() => {
        //load icons and backgrounds from firebasehook
        getIcon();
        getBackground();
    }, []);

    //if icon is in redux
    useEffect(() => {
        handleFetchIcons();
    }, [icons]);

    const handleFetchIcons = async () => {
        if (icons) {
            setProfileDecorations(icons); 
        }
    };

    //if background is in redux
    useEffect(() => {
        handleFetchBackgrounds();
    }, [backgrounds]);

    const handleFetchBackgrounds = async () => {
        if (backgrounds) {
            setProfileThemes(backgrounds); 
        }
    };

    function openModal(purchase) {
        setSelectedPurchase(purchase);
        setIsOpen(true);
    }
    
    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        //empty rn, might be used later
    }
    
    function closeModal() {
        setIsOpen(false);
    }

  return (
    <>
        <h1>Points Shop</h1>
        <h2>Profile Decorations</h2>
        <div id='profileDecorations'>
            {profileDecorations.map(dec => (
                <ProfileDecorations key={dec.name} decorations={dec} openModal={openModal}/>
            ))}
        </div>
        <h2>Profile Themes</h2>
        <div id='profileThemes'>
            {profileThemes.map(theme => (
                <ProfileThemes key={theme.name} theme={theme} openModal={openModal}/>
            ))}
        </div>
        <div>
            <PurchaseModel
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                selectedPurchase={selectedPurchase}
            />
        </div>
    </>
  );
};

export default Store;