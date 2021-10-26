// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6nmwZFKpfxomfk70W9yqm7r7ojChh8bc",
  authDomain: "instagram-clone-3eaae.firebaseapp.com",
  projectId: "instagram-clone-3eaae",
  storageBucket: "instagram-clone-3eaae.appspot.com",
  messagingSenderId: "607094989531",
  appId: "1:607094989531:web:cb07cd576f3f6ce9b8a2fe",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export { app, db, storage };
