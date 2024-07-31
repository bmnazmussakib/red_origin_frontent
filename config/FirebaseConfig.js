// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, FacebookAuthProvider ,signInWithPopup } from "firebase/auth";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB55XSikpTrtcCYcm5G1d3vvC6AUHTYEOU",
  authDomain: "social-login-9db83.firebaseapp.com",
  projectId: "social-login-9db83",
  storageBucket: "social-login-9db83.appspot.com",
  messagingSenderId: "563751960324",
  appId: "1:563751960324:web:95597291204fbf3c899a51",
  measurementId: "G-H9ERLS6NBV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const facebook = new FacebookAuthProvider();

