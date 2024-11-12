import Modal from 'react-modal';
import { useFirebaseHook } from '../../../../Firebase/FireBaseHook'
import React, { useEffect, useState } from 'react';
import '../Store.css';
import { useSelector } from 'react-redux';
import { auth } from '../../../../Firebase/Firebase';
import { useAuth } from '../../../../Context/AuthContext';

function PurchaseModal({ isOpen, onRequestClose: closeModel, selectedPurchase }) {

    const {user, isAuthenticated} = useAuth();
    const [credit, setCredit] = useState(0);
    const {purchaseIconInStore, purchaseBackgroundInStore} = useFirebaseHook();

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

    const PurchaseIcon = async () => {
        try{
            const authUser = auth.currentUser;
            //call hook to update user with the selected purchase
            await purchaseIconInStore(authUser.uid, user, selectedPurchase);
            closeModel();
        }
        catch(error){
            console.log(error);
        }
    }

    const PurchaseBackground = async () => {
        try{
            const authUser = auth.currentUser;
            //call hook to update user with the selected purchase
            await purchaseBackgroundInStore(authUser.uid, user, selectedPurchase);
            closeModel();
        }
        catch(error){
            console.log(error);
        }
    }
    useEffect(() => {
        console.log("user", user);
    })


    return (
        <Modal
            className="purchaseModal"
            isOpen={isOpen}
            style={modalStyle}
            onRequestClose={closeModel}
            contentLabel="PurchaseModal"
        >
            <button className="closeBtn" onClick={closeModel}>X</button>
            {selectedPurchase && <h2>{selectedPurchase.name}</h2>}
            {selectedPurchase && selectedPurchase.type === "icon" && (
                <div className="profileImgHolder">
                    <img className="icon" src={selectedPurchase.img} alt={selectedPurchase.name} />
                    <img className="rounded dummyProfile" src="https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg" alt="Profile" />
                </div>
            )}
            {selectedPurchase && selectedPurchase.type === "bg" && (
                <img className="bg" src={selectedPurchase.img} alt={selectedPurchase.name} />
            )}
            {selectedPurchase && (
                <button className='itemCost unpurchased' onClick={selectedPurchase.type === "icon" ? PurchaseIcon : PurchaseBackground}>Purchase for {selectedPurchase.cost}</button>
            )}
        </Modal>
    );
}

export default PurchaseModal;