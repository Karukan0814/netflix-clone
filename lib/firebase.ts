// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-eOZfCNd_WdRq804sVFqzeny44-M0H1Y",
  authDomain: "netflix-clone-bd72d.firebaseapp.com",
  projectId: "netflix-clone-bd72d",
  storageBucket: "netflix-clone-bd72d.appspot.com",
  messagingSenderId: "852054614214",
  appId: "1:852054614214:web:70cca2d4c92c4f13d077c7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

const auth = getAuth(app);

export { db, auth };
