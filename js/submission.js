import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Initialize Firebase Firestore and Auth
const db = getFirestore();
const auth = getAuth();

console.log('Firebase initialized');

// Function to handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();
    console.log('Form submit event triggered');

    const type = document.getElementById('suggestion-type').value;
    const suggestion = document.getElementById('suggestion-text').value;
    const user = auth.currentUser;

    console.log('Form data:', { type, suggestion });
    console.log('Current user:', user);

    if (user) {
        try {
            const docRef = await addDoc(collection(db, 'suggestions'), {
                type: type,
                suggestion: suggestion,
                email: user.email,
                time: Timestamp.now(),
                status: 'processing',
                resolution: ''
            });
            console.log('Document written with ID: ', docRef.id);
            alert('Suggestion submitted successfully!');
            document.getElementById('suggestion-form').reset();
        } catch (e) {
            console.error('Error adding document:', e);
            alert('Error submitting suggestion: ' + e.message);
        }
    } else {
        console.log('User not signed in');
        alert('You must be signed in to submit a suggestion.');
    }
}

function updateUIOnAuthStateChange(user) {
    console.log('Auth state changed:', user);
    const signInBtn = document.getElementById('signin-btn');
    const signOutBtn = document.getElementById('signout-btn');
    const submitSuggestionBtn = document.getElementById('submit-suggestion-btn');

    if (user) {
        signInBtn.classList.add('hidden');
        signOutBtn.classList.remove('hidden');
        submitSuggestionBtn.classList.remove('hidden');
    } else {
        signInBtn.classList.remove('hidden');
        signOutBtn.classList.add('hidden');
        submitSuggestionBtn.classList.add('hidden');
    }
}

document.getElementById('suggestion-form').addEventListener('submit', handleFormSubmit);
console.log('Form submit handler attached');

onAuthStateChanged(auth, (user) => {
    console.log('onAuthStateChanged triggered');
    updateUIOnAuthStateChange(user);
    if (!user) {
        alert('Please sign in to submit a suggestion.');
        window.location.href = "#signin-btn";
    }
});

document.getElementById('suggestion-form').addEventListener('focus', (event) => {
    console.log('Form focus event triggered');
    const user = auth.currentUser;
    if (!user) {
        alert('Please sign in to submit a suggestion.');
        window.location.href = "#signin-btn";
    }
}, true);

console.log('Form focus handler attached');