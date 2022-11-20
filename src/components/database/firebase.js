import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBsYMhj4hjrdEAOKLXR-2NM8ipHsUC2gok",
    authDomain: "commands-3a863.firebaseapp.com",
    projectId: "commands-3a863",
    storageBucket: "commands-3a863.appspot.com",
    messagingSenderId: "130402729644",
    appId: "1:130402729644:web:be8382d8e4c96d7cc2a909",
    databaseURL: 'https://commands-3a863-default-rtdb.firebaseio.com',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export default db;
