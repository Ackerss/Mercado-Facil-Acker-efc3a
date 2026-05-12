import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCVIlp7uOCRkTGnNxhK62FNxaST_bRRXuM",
  authDomain: "mercado-facil-acker.firebaseapp.com",
  projectId: "mercado-facil-acker",
  storageBucket: "mercado-facil-acker.firebasestorage.app",
  messagingSenderId: "107008478700",
  appId: "1:107008478700:web:26ebc1f6d7c6b4643f04c9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, signInAnonymously };
