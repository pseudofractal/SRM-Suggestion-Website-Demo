import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Initialize Firebase Firestore and Auth
const db = getFirestore();
const auth = getAuth();

// Function to handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();
    const type = document.getElementById('suggestion-type').value;
    const suggestion = document.getElementById('suggestion-text').value;
    const user = auth.currentUser;

    console.log('Submitting suggestion:', type, suggestion);
    console.log('Current user:', user);

    if (user) {
        try {
            const docRef = await addDoc(collection(db, 'suggestions'), {
                type: type,
                suggestion: suggestion,
                authorId: user.uid,
                time: Timestamp.now(),
                status: 'processing',
                resolution: ''
            });
            console.log('Document written with ID: ', docRef.id);
            alert('Suggestion submitted successfully!');
            // Optionally clear the form
            document.getElementById('suggestion-form').reset();
        } catch (e) {
            console.error('Error adding document: ', e);
            alert('Error submitting suggestion: ' + e.message);
        }
    } else {
        alert('You must be signed in to submit a suggestion.');
    }
}

// Check if user is signed in before showing the form
function checkSignInStatus() {
    const user = auth.currentUser;
    if (!user) {
        alert('Please sign in to submit a suggestion.');
        window.location.href = "#signin-btn";
    }
}

// Attach the form submit handler
document.getElementById('suggestion-form').addEventListener('submit', handleFormSubmit);

// Check sign-in status when trying to access the form
document.getElementById('suggestion-form').addEventListener('focus', checkSignInStatus, true);