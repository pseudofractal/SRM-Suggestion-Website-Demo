import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDllOEaNJTcldiOZR6DwNL-VnbbCmDtXB4",
    authDomain: "srm-web-app.firebaseapp.com",
    projectId: "srm-web-app",
    storageBucket: "srm-web-app.appspot.com",
    messagingSenderId: "854722873993",
    appId: "1:854722873993:web:2d5ba66678f63b81fbd458",
    measurementId: "G-GR0RCESHZZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        console.log('User signed in');
        const user = result.user;
        updateUIOnSignIn(user);
    } catch (error) {
        console.error('Sign in failed:', error);
        alert('Sign in failed: ' + error.message);
    }
}

export async function signOutUser() {
    try {
        await signOut(auth);
        console.log('User signed out');
        updateUIOnSignOut();
    } catch (error) {
        console.error('Sign out failed:', error);
        alert('Sign out failed: ' + error.message);
    }
}

function updateUIOnSignIn(user) {
    document.getElementById('signin-btn').classList.add('hidden');
    document.getElementById('signout-btn').classList.remove('hidden');
    console.log('User Details:', user);
}

function updateUIOnSignOut() {
    document.getElementById('signin-btn').classList.remove('hidden');
    document.getElementById('signout-btn').classList.add('hidden');
    console.log('UI updated for sign out.');
}

window.signInWithGoogle = signInWithGoogle;
window.signOutUser = signOutUser;
window.updateUIOnSignIn = updateUIOnSignIn;
window.updateUIOnSignOut = updateUIOnSignOut;