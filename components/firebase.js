// Import the functions you need from the SDKs you need
// import * as firebase from "firebase/app";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage'
import { getStorage, ref } from "firebase/storage";
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "Refer to report.pdf",
  authDomain: "tomotodo-fyp.firebaseapp.com",
  projectId: "tomotodo-fyp",
  storageBucket: "tomotodo-fyp.appspot.com",
  messagingSenderId: "251679075383",
  appId: "1:251679075383:web:0da223572159ff2a0723b2"
};

// Initialize Firebase
if (!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}
else {
    firebase.app()
}

const app = initializeApp(firebaseConfig);
const auth = firebase.auth()
const storage = getStorage(app);

export { app, firebase, auth, storage };