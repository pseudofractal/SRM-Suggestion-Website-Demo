import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

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
const db = getFirestore(app);

export async function fetchSuggestions() {
    const suggestionsCol = collection(db, 'suggestions');
    try {
        const suggestionSnapshot = await getDocs(suggestionsCol);
        const suggestionList = suggestionSnapshot.docs.map(doc => doc.data());
        displaySuggestions(suggestionList);
    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
}

function displaySuggestions(suggestions) {
    const suggestionContainer = document.querySelector('.grid section');
    suggestions.forEach(suggestion => {
        console.log(suggestion);
        const card = document.createElement('div');
        card.classList.add('suggestion-card');

        const cardHeader = document.createElement('div');
        cardHeader.classList.add('card-header');
        const headerIcon = document.createElement('i');
        headerIcon.classList.add('fas', 'fa-utensils');
        cardHeader.appendChild(headerIcon);
        const title = document.createElement('span');
        title.textContent = suggestion.suggestion;
        cardHeader.appendChild(title);
        card.appendChild(cardHeader);

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const timeItem = document.createElement('div');
        timeItem.classList.add('card-item');
        const timeIcon = document.createElement('i');
        timeIcon.classList.add('fas', 'fa-clock');
        timeItem.appendChild(timeIcon);
        const timeText = document.createElement('span');
        timeText.textContent = humanReadableTime(suggestion.timestamp);
        timeItem.appendChild(timeText);
        cardBody.appendChild(timeItem);

        const statusItem = document.createElement('div');
        statusItem.classList.add('card-item');
        const statusIcon = document.createElement('i');
        statusIcon.classList.add('fas', 'fa-cog');
        statusItem.appendChild(statusIcon);
        const statusText = document.createElement('span');
        statusText.textContent = suggestion.status;
        statusItem.appendChild(statusText);
        const typeIcon = document.createElement('i');
        if (suggestion.status === 'Pending') {
            typeIcon.classList.add('fas', 'fa-exclamation-circle');
        }
        else if (suggestion.status === 'In Progress') {
            typeIcon.classList.add('fas', 'fa-spinner');
        }
        else if (suggestion.status === 'Resolved') {
            typeIcon.classList.add('fas', 'fa-check-circle');
        }
        statusItem.appendChild(typeIcon);
        const typeText = document.createElement('span');
        typeText.textContent = suggestion.type;
        statusItem.appendChild(typeText);
        cardBody.appendChild(statusItem);

        const resolutionItem = document.createElement('div');
        resolutionItem.classList.add('card-item');
        const resolutionIcon = document.createElement('i');
        resolutionIcon.classList.add('fas', 'fa-comment-dots');
        resolutionItem.appendChild(resolutionIcon);
        const resolutionText = document.createElement('span');
        resolutionText.textContent = suggestion.resolution;
        resolutionItem.appendChild(resolutionText);
        cardBody.appendChild(resolutionItem);

        card.appendChild(cardBody);

        suggestionContainer.appendChild(card);
    });
}

window.addEventListener('DOMContentLoaded', fetchSuggestions);

function humanReadableTime(timestamp) {
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    return date.toLocaleString();
}