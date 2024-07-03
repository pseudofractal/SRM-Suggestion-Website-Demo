import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function submitSuggestion() {
    const suggestionType = document.getElementById('suggestion-type').value;
    const suggestionText = document.getElementById('suggestion-text').value;

    if (!suggestionType || !suggestionText) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const user = auth.currentUser;
        if (!user || !user.email.endsWith("@iisermohali.ac.in")) {
            console.log(user.email);
            alert('You must be signed in with IISER GMail ID to submit a suggestion');
            return;
        }

        await addDoc(collection(db, 'suggestions'), {
            email: user.email,
            resolution: "Waiting for next council meeting.",
            status: "Processing",
            suggestion: suggestionText,
            time: Timestamp.now(),
            type: suggestionType,
        });

        alert('Suggestion submitted successfully');
        document.getElementById('suggestion-type').value = '';
        document.getElementById('suggestion-text').value = '';
    } catch (error) {
        console.error('Error adding document: ', error);
        alert('Failed to submit suggestion: ' + error.message);
    }
}

window.submitSuggestion = submitSuggestion;