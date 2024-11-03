import React, { useEffect, useState } from 'react';
import { Outlet, Link } from "react-router-dom";
import './Store.css';
import { fetchAllIcons, fetchAllBackgrounds, getImage } from '../../../Firebase/FirebaseUtils';
import Modal from 'react-modal';
import zIndex from '@mui/material/styles/zIndex';


function Store() {
    //For now, just making dummy arrays of hypothetical decorations will work.
    //Eventually, these should probably be loaded dynamically from a database, either local or online
    const [profileDecorations, setProfileDecorations] = useState([]);
    const [profileThemes, setProfileThemes] = useState([]);
    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [modalIsOpen, setIsOpen] = useState(false);
    const handleFetchIcons = async () => {
        const icons = await fetchAllIcons();
        if (icons) {
            const iconPromises = icons.map(async icon => {
                const downloadPath = await getImage(icon.path);
                return { name: icon.name, cost: icon.cost, img: downloadPath, type: "icon" };
            });
            const newIcons = await Promise.all(iconPromises);
            setProfileDecorations(newIcons); 
        }
    };

    const handleFetchBackgrounds = async () => {
        const bgs = await fetchAllBackgrounds();
        if (bgs) {
            const bgPromises = bgs.map(async bg => {
                const downloadPath = await getImage(bg.path);
                return { name: bg.name, cost: bg.cost, img: downloadPath, type: "bg" };
            });
            const newBgs = await Promise.all(bgPromises);
            setProfileThemes(newBgs); 
        }
    };

    //Modal doesn't like its styling coming from an external file, i think. Not totally sure why, but oh well
    const modalStyle = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          zIndex: '100',
          
        },
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

    useEffect(() => {
        handleFetchIcons();
        handleFetchBackgrounds();
        console.log(profileDecorations)
    }, [])

  return (
    <>
    <h1>Points Shop</h1>
    <h2>Profile Decorations</h2>
    <div id='profileDecorations'>
        {profileDecorations.map(dec => (
            <div>
                <div class="profileImgHolder">
                    <img class="icon" src={dec.img}></img>
                    <img class="rounded dummyProfile" src="https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"></img>
                </div>
                <p key={dec.name}>{dec.name}</p>
                <button class='itemCost' onClick={() => openModal(dec)}>Cost: {dec.cost}</button>
            </div>
        ))}
    </div>
    <h2>Profile Themes</h2>
    <div id='profileThemes'>
        {profileThemes.map(dec => (
            <div key={dec.name}>
                <img class="bg" src={dec.img}></img>
                <p key={dec.name}>{dec.name}</p>
                <button class='itemCost' onClick={() => openModal(dec)}>Cost: {dec.cost}</button>
            </div>
        ))}
    </div>
    <div>
      <Modal
        className="purchaseModal"
        isOpen={modalIsOpen}
        style={modalStyle}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        contentLabel="PurchaseModal"
      >
        <button onClick={closeModal}>X</button>
        <h2>{selectedPurchase.name}</h2>
        {selectedPurchase.type == "icon" && 
            <div class="profileImgHolder">
                <img class="icon" src={selectedPurchase.img}></img>
                <img class="rounded dummyProfile" src="https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"></img>
            </div>
        }
        {selectedPurchase.type == "bg" && 
            <img class="bg" src={selectedPurchase.img}></img>
        }
        <button class='itemCost'>Purchase for {selectedPurchase.cost}</button>
      </Modal>
    </div>
    </>
  );
};

export default Store;