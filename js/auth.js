import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from "./firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        handleSignInSuccess();
    } catch (error) {
        handleSignInError(error);
    }
}

function handleSignInSuccess() {
    toggleElementVisibility('signin-btn', false);
    toggleElementVisibility('submit-suggestion-btn', true);
    toggleElementVisibility('submit-suggestion', true);
}

function handleSignInError(error) {
    console.error('Sign in failed:', error);
    alert('Sign in failed: ' + error.message);
}

function toggleElementVisibility(elementId, isVisible) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.toggle('hidden', !isVisible);
    }
}

window.signInWithGoogle = signInWithGoogle;
