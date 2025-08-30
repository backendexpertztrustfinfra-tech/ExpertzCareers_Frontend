import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from  "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC7nlJvYjDZx3i6DFiCEQK4CfQS9fFjthk",
  authDomain: "expertz-careers.firebaseapp.com",
  projectId: "expertz-careers",
  storageBucket: "expertz-careers.appspot.com",  
  messagingSenderId: "448372401493",
  appId: "1:448372401493:web:e6a203171fe7c972e2fbdc",
  measurementId: "G-V7E00DEQVG"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

const db = getFirestore(app);

export { auth, googleProvider, db };

