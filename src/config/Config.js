import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPEDKqYtftMDgRt9Tl71EcklM-02GklbA",
  authDomain: "anime-app-47e9a.firebaseapp.com",
  projectId: "anime-app-47e9a",
  storageBucket: "anime-app-47e9a.appspot.com",
  messagingSenderId: "530681998233",
  appId: "1:530681998233:web:110dc2401a001a72964108",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);
