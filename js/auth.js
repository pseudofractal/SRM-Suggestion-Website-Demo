import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { firebaseConfig } from "./firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        updateUIOnSignIn();
    } catch (error) {
        console.error('Sign in failed:', error);
        alert('Sign in failed: ' + error.message);
    }
}

function updateUIOnSignIn() {
    document.getElementById('signin-btn').classList.add('hidden');
    document.getElementById('submit-suggestion-btn').classList.remove('hidden');
    document.getElementById('submit-suggestion').classList.remove('hidden');
}

window.signInWithGoogle = signInWithGoogle;
window.updateUIOnSignIn = updateUIOnSignIn;