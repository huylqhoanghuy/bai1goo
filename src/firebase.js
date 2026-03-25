import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJpdNd9R47FjKX9FXMcbiA1LoK75TBohI",
  authDomain: "bai1goo.firebaseapp.com",
  projectId: "bai1goo",
  storageBucket: "bai1goo.firebasestorage.app",
  messagingSenderId: "965940445104",
  appId: "1:965940445104:web:74aeb671470854472fa075",
  measurementId: "G-L6MQCCESZG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics, db };
