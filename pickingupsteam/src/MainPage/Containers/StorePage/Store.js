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
    
    function closeModal() {
        setIsOpen(false);
    }

  return (
    <div>
        <h1 className='sectionHead'>Profile Decorations</h1>
        <div id='profileDecorations'>
            {profileDecorations.map(dec => (
                <ProfileDecorations key={dec.name} decorations={dec} openModal={openModal}/>
            ))}
        </div>
        <h1 className='sectionHead'>Profile Themes</h1>
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
    </div>
  );
};

export default Store;