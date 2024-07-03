import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from "./firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

async function signInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        if (result.user.email.endsWith("@iisermohali.ac.in")) {
            handleSignInSuccess();
        } else {
            await signOut(auth);
            alert('You must sign in with an IISER Mohali email address.');
        }
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
    element.classList.toggle('hidden', !isVisible);
}

window.addEventListener('load', async () => {
    try {
        await signOut(auth);
        console.log('Cleared auth data on page reload.');
    } catch (error) {
        console.error('Error clearing auth data:', error);
    }
});

window.signInWithGoogle = signInWithGoogle;
