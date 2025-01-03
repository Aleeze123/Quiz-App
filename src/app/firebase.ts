// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyClMGFePSeUCnSGDZcyQTqKMbKa8LbVLwc",
  authDomain: "task2-ef43e.firebaseapp.com",
  projectId: "task2-ef43e",
  storageBucket: "task2-ef43e.firebasestorage.app",
  messagingSenderId: "646316459477",
  appId: "1:646316459477:web:e728158b3ca444acfd695c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const initFirebase=()=>{
    return app
}
