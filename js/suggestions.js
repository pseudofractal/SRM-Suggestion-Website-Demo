import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseConfig } from "./firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function fetchSuggestions() {
    console.log('Fetching Suggestions from firebase');
    const suggestionsCol = collection(db, 'suggestions');
    try {
        const suggestionSnapshot = await getDocs(suggestionsCol);
        const suggestions = suggestionSnapshot.docs.map(doc => doc.data());
        applyFilters(suggestions);
    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
}

function applyFilters(suggestions) {
    const filterType = document.getElementById('filter-type').value;
    const filterStatus = document.getElementById('filter-status').value;
    console.log('Filter Status: ', filterStatus);
    console.log('Filter Type: ', filterType);
    const filteredSuggestions = suggestions.filter(suggestion => {
        const matchesType = filterType === 'All' || suggestion.type === filterType;
        const matchesStatus = filterStatus === 'All' || suggestion.status === filterStatus;
        return matchesType && matchesStatus;
    });

    if (filteredSuggestions.length === 0) {
        displayNoSuggestionsMessage();
        return;
    }

    displaySuggestions(filteredSuggestions);
}

function displayNoSuggestionsMessage() {
    clearSuggestions();
    const suggestionContainer = document.getElementById('suggestions-list');
    const emptySuggestion = document.createElement('span');
    emptySuggestion.textContent = "No suggestions found with the current filters.";
    suggestionContainer.appendChild(emptySuggestion);
}

function clearSuggestions() {
    const suggestionContainer = document.getElementById('suggestions-list');
    suggestionContainer.innerHTML = '';
}

function displaySuggestions(suggestions) {
    clearSuggestions();
    const suggestionContainer = document.getElementById('suggestions-list');

    suggestions.forEach(suggestion => {
        const card = createSuggestionCard(suggestion);
        suggestionContainer.appendChild(card);
    });
}

function createSuggestionCard(suggestion) {
    const card = document.createElement('div');
    card.classList.add('suggestion-card');
    card.classList.add(suggestion.status.toLowerCase());

    const cardHeader = createCardHeader(suggestion);
    const cardBody = createCardBody(suggestion);

    card.appendChild(cardHeader);
    card.appendChild(cardBody);

    return card;
}

function createCardHeader(suggestion) {
    const cardHeader = document.createElement('div');
    cardHeader.classList.add('card-header');

    const title = document.createElement('p');
    title.classList.add('title-text');
    title.textContent = suggestion.suggestion;
    cardHeader.appendChild(title);

    const expandButtonContainer = document.createElement('div');
    expandButtonContainer.classList.add('expand-button-container');

    const expandButton = document.createElement('button');
    expandButton.textContent = 'More Info';
    expandButton.classList.add('expand-button');
    expandButton.addEventListener('click', (event) => {
        const cardBody = event.target.closest('.suggestion-card').querySelector('.card-body');
        cardBody.classList.toggle('expanded');
        expandButton.textContent = cardBody.classList.contains('expanded') ? 'Less Info' : 'More Info';
    });

    expandButtonContainer.appendChild(expandButton);
    cardHeader.appendChild(expandButtonContainer);
    return cardHeader;
}

function createCardBody(suggestion) {
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const timeItem = createCardItem('fa-clock', humanReadableTime(suggestion.time));
    const statusItem = createCardItem('fa-info', suggestion.status);
    const typeItem = createCardItem(getTypeIcon(suggestion.type), suggestion.type);
    const resolutionItem = createCardItem('fa-comment-dots', suggestion.resolution, true);

    cardBody.appendChild(timeItem);
    cardBody.appendChild(statusItem);
    cardBody.appendChild(typeItem);
    cardBody.appendChild(resolutionItem);

    return cardBody;
}

function createCardItem(iconClass, textContent, isParagraph = false) {
    const cardItem = document.createElement('div');
    cardItem.classList.add('card-item');
    const icon = document.createElement('i');
    icon.classList.add('icon', 'fas', iconClass);
    cardItem.appendChild(icon);
    const text = isParagraph ? document.createElement('p') : document.createElement('span');
    if (isParagraph) {
        text.classList.add('resolution-text');
    }
    text.textContent = textContent;
    cardItem.appendChild(text);
    return cardItem;
}

function getTypeIcon(type) {
    return type === 'Dish' ? 'fa-utensils' : 'fa-question';
}

function humanReadableTime(timestamp) {
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    return date.toLocaleString();
}

window.addEventListener('DOMContentLoaded', async () => {
    await fetchSuggestions();
});

window.fetchSuggestions = fetchSuggestions;