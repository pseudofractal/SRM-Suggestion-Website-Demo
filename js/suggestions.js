import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseConfig } from "./firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let allSuggestions = [];

export async function fetchSuggestions() {
    const suggestionsCol = collection(db, 'suggestions');
    try {
        const suggestionSnapshot = await getDocs(suggestionsCol);
        allSuggestions = suggestionSnapshot.docs.map(doc => doc.data());
        applyFilters();
    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
}

function applyFilters() {
    const filterType = document.getElementById('filter-type').value;
    const filterStatus = document.getElementById('filter-status').value;

    const filteredSuggestions = allSuggestions.filter(suggestion => {
        const matchesType = filterType === 'all' || suggestion.type === filterType;
        const matchesStatus = filterStatus === 'all' || suggestion.status === filterStatus;
        return matchesType && matchesStatus;
    });
    displaySuggestions(filteredSuggestions);
    if (filterType !== 'all' && filterStatus !== 'all') {

    }
}

function clearSuggestions() {
    const suggestionContainer = document.getElementById('suggestions-list');
    suggestionContainer.innerHTML = '';
}

function displaySuggestions(suggestions) {
    clearSuggestions();
    const suggestionContainer = document.getElementById('suggestions-list');
    suggestions.forEach(suggestion => {
        const card = document.createElement('div');
        card.classList.add('suggestion-card');

        const cardHeader = document.createElement('div');
        cardHeader.classList.add('card-header');
        const title = document.createElement('span');
        title.textContent = suggestion.suggestion;
        cardHeader.appendChild(title);
        card.appendChild(cardHeader);

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const timeItem = document.createElement('div');
        timeItem.classList.add('card-item');
        const timeIcon = document.createElement('i');
        timeIcon.classList.add('icon', 'fas', 'fa-clock');
        timeItem.appendChild(timeIcon);
        const timeText = document.createElement('span');
        timeText.textContent = humanReadableTime(suggestion.time);
        timeItem.appendChild(timeText);
        cardBody.appendChild(timeItem);

        const statusItem = document.createElement('div');
        statusItem.classList.add('card-item');
        const statusIcon = document.createElement('i');
        statusIcon.classList.add('icon', 'fas', 'fa-info');
        statusItem.appendChild(statusIcon);
        const statusText = document.createElement('span');
        statusText.textContent = suggestion.status;
        statusItem.appendChild(statusText);

        if (suggestion.status === 'Processing') {
            card.classList.add('processing');
        } else if (suggestion.status === 'Completed') {
            card.classList.add('completed');
        } else if (suggestion.status === 'Rejected') {
            card.classList.add('rejected');
        }

        const typeIcon = document.createElement('i');
        if (suggestion.type === 'Dish') {
            typeIcon.classList.add('icon', 'fas', 'fa-utensils');
        } else if (suggestion.type === 'General') {
            typeIcon.classList.add('icon', 'fas', 'fa-question');
        }
        statusItem.appendChild(typeIcon);
        const typeText = document.createElement('span');
        typeText.textContent = suggestion.type;
        statusItem.appendChild(typeText);
        cardBody.appendChild(statusItem);

        const resolutionItem = document.createElement('div');
        resolutionItem.classList.add('card-item');
        const resolutionIcon = document.createElement('i');
        resolutionIcon.classList.add('icon', 'fas', 'fa-comment-dots');
        resolutionItem.appendChild(resolutionIcon);
        const resolutionText = document.createElement('span');
        resolutionText.textContent = suggestion.resolution;
        resolutionItem.appendChild(resolutionText);
        cardBody.appendChild(resolutionItem);

        card.appendChild(cardBody);

        suggestionContainer.appendChild(card);
    });
}

window.addEventListener('DOMContentLoaded', () => {
    fetchSuggestions();
});

function humanReadableTime(timestamp) {
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    return date.toLocaleString();
}

window.fetchSuggestions = fetchSuggestions;
