import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function submitSuggestion() {
    const suggestionType = getInputValue('suggestion-type');
    const suggestionText = getInputValue('suggestion-text');

    if (!suggestionType || !suggestionText) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const user = auth.currentUser;
        if (!isValidUser(user)) {
            alert('You must be signed in with IISER GMail ID to submit a suggestion');
            return;
        }

        await addSuggestionToDB(user.email, suggestionType, suggestionText);
        alert('Suggestion submitted successfully');
        resetForm();
    } catch (error) {
        handleSubmissionError(error);
    }
}

function getInputValue(elementId) {
    return document.getElementById(elementId).value;
}

function isValidUser(user) {
    return user && user.email.endsWith("@iisermohali.ac.in");
}

async function addSuggestionToDB(email, type, suggestion) {
    await addDoc(collection(db, 'suggestions'), {
        email,
        resolution: "Waiting for next council meeting.",
        status: "Processing",
        suggestion,
        time: Timestamp.now(),
        type,
    });
}

function resetForm() {
    setInputValue('suggestion-type', '');
    setInputValue('suggestion-text', '');
}

function setInputValue(elementId, value) {
    document.getElementById(elementId).value = value;
}

function handleSubmissionError(error) {
    console.error('Error adding document: ', error);
    alert('Failed to submit suggestion: ' + error.message);
}

window.submitSuggestion = submitSuggestion;