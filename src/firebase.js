import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAbeAQXhkq87nDBpFg9v8YP81DyIDPSbDwY",
  authDomain: "a-world-of-change---scores.firebaseapp.com",
  projectId: "a-world-of-change---scores",
  storageBucket: "a-world-of-change---scores.appspot.com",
  messagingSenderId: "1023395063116",
  appId: "1:1023395063116:web:3a3b8f87e6066bb2b59be9"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
