// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDOWUxHtbX62yrfL0utDpsh4Skxpp6sT0g",
  authDomain: "ktor-server-b3tray3r.firebaseapp.com",
  projectId: "ktor-server-b3tray3r",
  storageBucket: "ktor-server-b3tray3r.appspot.com",
  messagingSenderId: "1034220173171",
  appId: "1:1034220173171:web:8828b2a076955015b0f706",
  measurementId: "G-TZSYCR37HH"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
