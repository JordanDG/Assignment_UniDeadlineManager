import { initializeApp } from 'firebase/app';
import { browserLocalPersistence, getAuth, setPersistence } from 'firebase/auth';
// import 'firebase/auth';
// import 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = ({
    apiKey: "AIzaSyBgd7poLuKn3CbSkJj7A2QxG1BfjvSf-Hs",
    authDomain: "unideadlinemanager-bab90.firebaseapp.com",
    databaseURL: "https://unideadlinemanager-bab90-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "unideadlinemanager-bab90",
    storageBucket: "unideadlinemanager-bab90.appspot.com",
    messagingSenderId: "59406447338",
    appId: "1:59406447338:web:3eef59076acb43d0801d93",
});

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);
const db = getFirestore();
export { db } 
export default app;