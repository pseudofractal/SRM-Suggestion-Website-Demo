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
    console.log(suggestion);
    const suggestionContainer = document.querySelector('.grid section');
    suggestions.forEach(suggestion => {
        const card = document.createElement('div');
        card.classList.add('suggestion-card');

        const cardHeader = document.createElement('div');
        cardHeader.classList.add('card-header');
        const typeIcon = document.createElement('i');
        typeIcon.classList.add('fas', 'fa-utensils');
        cardHeader.appendChild(typeIcon);
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
        timeText.textContent = suggestion.time;
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