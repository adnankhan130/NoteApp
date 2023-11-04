// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAjQr3Ifo3ceH5oBDA98U1wrZBrOL5HZSw",
  authDomain: "note-app-415f3.firebaseapp.com",
  projectId: "note-app-415f3",
  storageBucket: "note-app-415f3.appspot.com",
  messagingSenderId: "151555291785",
  appId: "1:151555291785:web:43105e89ea922d14d6e458"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export  {app, auth, db};