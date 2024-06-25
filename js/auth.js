import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

// Configuration and initialization of Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDllOEaNJTcldiOZR6DwNL-VnbbCmDtXB4",
    authDomain: "srm-web-app.firebaseapp.com",
    projectId: "srm-web-app",
    storageBucket: "srm-web-app.appspot.com",
    messagingSenderId: "854722873993",
    appId: "1:854722873993:web:2d5ba66678f63b81fbd458",
    measurementId: "G-GR0RCESHZZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Asynchronous function to handle Google sign-in
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

// Asynchronous function to handle sign-out
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

// Function to update UI on sign-in
function updateUIOnSignIn(user) {
    document.getElementById('signin-btn').classList.add('hidden');
    document.getElementById('signout-btn').classList.remove('hidden');
    console.log('User Details:', user);
    // Implement UI changes when user signs in
    // e.g., display user name, change login/logout buttons
}

// Function to update UI on sign-out
function updateUIOnSignOut() {
    document.getElementById('signin-btn').classList.remove('hidden');
    document.getElementById('signout-btn').classList.add('hidden');
    console.log('UI updated for sign out.');
    // Implement UI changes when user signs out
    // e.g., hide user specific information, show login button
}

// Expose functions to the global scope for HTML button event handlers
window.signInWithGoogle = signInWithGoogle;
window.signOutUser = signOutUser;
window.updateUIOnSignIn = updateUIOnSignIn;
window.updateUIOnSignOut = updateUIOnSignOut;