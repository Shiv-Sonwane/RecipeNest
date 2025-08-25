import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDnFDIEcWZ0IYhiTxIJWQ0IpTc8ZuY24BI",
    authDomain: "recipenest-4b4e9.firebaseapp.com",
    projectId: "recipenest-4b4e9",
    storageBucket: "recipenest-4b4e9.firebasestorage.app",
    messagingSenderId: "653772495841",
    appId: "1:653772495841:web:acb43cc456d1e7665f90a0",
    measurementId: "G-S1ZPMDRPJD",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);