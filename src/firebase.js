
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCEyg00W31lqYMWjsngqiGlXVXIWPlGyug",
    authDomain: "chat-app-6b231.firebaseapp.com",
    projectId: "chat-app-6b231",
    storageBucket: "chat-app-6b231.appspot.com",
    messagingSenderId: "1094366414667",
    appId: "1:1094366414667:web:e764a548524cb1dcc6cace",
    measurementId: "G-TSTJNT6YQF"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
