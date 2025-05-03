// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDupwgdeD_cbq8GLJOgAadmi_wem5mS4kI",
  authDomain: "find-my-bills-95ab6.firebaseapp.com",
  projectId: "find-my-bills-95ab6",
  storageBucket: "find-my-bills-95ab6.firebasestorage.app",
  messagingSenderId: "926169946123",
  appId: "1:926169946123:web:c8e7234591e933d05a4f0e",
  measurementId: "G-9GRCW5KMZT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);