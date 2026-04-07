// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDtjI8kWizDIHUKoHpsJYVanKeYJR0vcKI",
  authDomain: "starrail-bakatare02.firebaseapp.com",
  projectId: "starrail-bakatare02",
  storageBucket: "starrail-bakatare02.firebasestorage.app",
  messagingSenderId: "654700794706",
  appId: "1:654700794706:web:c242a81e5eda245915a08b",
  measurementId: "G-TVYL56YGX9"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
