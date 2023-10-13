import { initializeApp } from "firebase/app";
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-estate-de967.firebaseapp.com",
    projectId: "mern-estate-de967",
    storageBucket: "mern-estate-de967.appspot.com",
    messagingSenderId: "1051564858417",
    appId: "1:1051564858417:web:62fff8ce865026fc6f0910"
};

export const app = initializeApp(firebaseConfig);