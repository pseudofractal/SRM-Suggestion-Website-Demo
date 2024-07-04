import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function submitSuggestion() {
    console.log("Submitting Suggestion");
    const suggestionType = getInputValue('suggestion-type');
    const suggestionText = getInputValue('suggestion-text');

    if (!suggestionType || !suggestionText) {
        alert('Please fill in all fields');
        return;
    }

    const user = auth.currentUser;
    if (!user) {
        alert('You must be signed in with IISER GMail ID to submit a suggestion');
        return;
    }

    try {
        await addSuggestionToDB(user.email, suggestionType, suggestionText);
        alert('Suggestion submitted successfully');
        resetForm();
    } catch (error) {
        console.error('Error adding suggestion:', error);
        alert('Failed to submit suggestion: ' + error.message);
    }
}

async function addSuggestionToDB(email, type, suggestion) {
    await addDoc(collection(db, 'suggestions'), {
        email,
        type,
        suggestion,
        resolution: 'Waiting for next council meeting.',
        status: 'Processing',
        time: Timestamp.now(),
        votes: 1,
        upvotedBy: [email],
        downvotedBy: []
    });
}

function getInputValue(elementId) {
    return document.getElementById(elementId).value;
}

function resetForm() {
    setInputValue('suggestion-type', '');
    setInputValue('suggestion-text', '');
}

function setInputValue(elementId, value) {
    document.getElementById(elementId).value = value;
}

window.submitSuggestion = submitSuggestion;