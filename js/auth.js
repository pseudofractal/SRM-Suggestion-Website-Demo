import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from "./firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

async function signInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        if (result.user.email.endsWith("@iisermohali.ac.in")) {
            handleSignInSuccess(result.user);
        } else {
            await signOut(auth);
            alert('You must sign in with an IISER Mohali email address.');
        }
    } catch (error) {
        handleSignInError(error);
    }
}

function handleSignInSuccess(user) {
    toggleElementVisibility('signin-btn', false);
    toggleElementVisibility('submit-suggestion-btn', true);
    toggleElementVisibility('submit-suggestion', true);
    document.getElementById('profile-pic').src = user.photoURL;
    toggleElementVisibility('profile-container', true);
}

function handleSignInError(error) {
    console.error('Sign in failed:', error);
    alert('Sign in failed: ' + error.message);
}

function toggleElementVisibility(elementId, isVisible) {
    const element = document.getElementById(elementId);
    element.classList.toggle('hidden', !isVisible);
}

async function signOutUser() {
    try {
        await signOut(auth);
        window.location.reload();
    } catch (error) {
        console.error('Sign out failed:', error);
        alert('Sign out failed: ' + error.message);
    }
}

window.addEventListener('load', async () => {
    onAuthStateChanged(auth, (user) => {
        if (user && user.email.endsWith("@iisermohali.ac.in")) {
            handleSignInSuccess(user);
        } else {
            toggleElementVisibility('signin-btn', true);
            toggleElementVisibility('submit-suggestion-btn', false);
            toggleElementVisibility('submit-suggestion', false);
            toggleElementVisibility('profile-container', false);
        }
    });
});

window.signInWithGoogle = signInWithGoogle;
window.signOutUser = signOutUser;
