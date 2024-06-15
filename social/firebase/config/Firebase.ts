import { initializeApp } from "firebase/app";
import { Auth, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBt1eGpktblIAOrI68tgPxCq9Fsa1xdSXI",
    authDomain: "while-2.firebaseapp.com",
    databaseURL: "https://while-2-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "while-2",
    storageBucket: "while-2.appspot.com",
    messagingSenderId: "759556546667",
    appId: "1:759556546667:web:9cd21fba85ac5d29e3912e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get the Auth instance
const auth: Auth = getAuth(app);

// Export the Auth instance and GoogleAuthProvider
export { auth, GoogleAuthProvider, app };

// Additional exports for signInWithEmailAndPassword and signInWithPopup
export { signInWithEmailAndPassword, signInWithPopup };
