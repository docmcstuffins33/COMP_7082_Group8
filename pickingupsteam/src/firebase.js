// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "pickingupsteam-8fd85.firebaseapp.com",
  projectId: "pickingupsteam-8fd85",
  storageBucket: "pickingupsteam-8fd85.appspot.com",
  messagingSenderId: "294197266919",
  appId: "1:294197266919:web:9f7d233f7724ebc6c01542"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);