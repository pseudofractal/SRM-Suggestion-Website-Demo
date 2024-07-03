import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseConfig } from "./firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function fetchSuggestions() {
    try {
        const suggestionsCol = collection(db, 'suggestions');
        const suggestionSnapshot = await getDocs(suggestionsCol);
        const suggestions = suggestionSnapshot.docs.map(doc => doc.data());
        applyFilters(suggestions);
    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
}

function applyFilters(suggestions) {
    const filterType = getInputValue('filter-type');
    const filterStatus = getInputValue('filter-status');
    const filteredSuggestions = suggestions.filter(suggestion => {
        const matchesType = filterType === 'All' || suggestion.type === filterType;
        const matchesStatus = filterStatus === 'All' || suggestion.status === filterStatus;
        return matchesType && matchesStatus;
    });

    if (filteredSuggestions.length === 0) {
        displayNoSuggestionsMessage();
    } else {
        displaySuggestions(filteredSuggestions);
    }
}

function displayNoSuggestionsMessage() {
    clearSuggestions();
    const suggestionContainer = document.getElementById('suggestions-list');
    const emptySuggestion = document.createElement('span');
    emptySuggestion.textContent = "No suggestions found with the current filters.";
    suggestionContainer.appendChild(emptySuggestion);
}

function clearSuggestions() {
    document.getElementById('suggestions-list').innerHTML = '';
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
    card.classList.add('suggestion-card', suggestion.status.toLowerCase());

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

    const expandButton = createExpandButton();
    cardHeader.appendChild(expandButton);

    return cardHeader;
}

function createExpandButton() {
    const expandButton = document.createElement('button');
    expandButton.textContent = 'More Info';
    expandButton.classList.add('expand-button');
    expandButton.addEventListener('click', event => {
        const cardBody = event.target.closest('.suggestion-card').querySelector('.card-body');
        cardBody.classList.toggle('expanded');
        expandButton.textContent = cardBody.classList.contains('expanded') ? 'Less Info' : 'More Info';
    });
    return expandButton;
}

function createCardBody(suggestion) {
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const timeItem = createCardItem('fa-clock', humanReadableTime(suggestion.time));
    const statusItem = createCardItem('fa-info', suggestion.status);
    const typeItem = createCardItem(getTypeIcon(suggestion.type), suggestion.type);
    const resolutionItem = createResolutionItem(suggestion.resolution);

    cardBody.appendChild(timeItem);
    cardBody.appendChild(statusItem);
    cardBody.appendChild(typeItem);
    cardBody.appendChild(resolutionItem);

    return cardBody;
}

function createCardItem(iconClass, textContent) {
    const cardItem = document.createElement('div');
    cardItem.classList.add('card-item');

    const icon = document.createElement('i');
    icon.classList.add('icon', 'fas', iconClass);
    cardItem.appendChild(icon);

    const text = document.createElement('span');
    text.textContent = textContent;
    cardItem.appendChild(text);

    return cardItem;
}

function createResolutionItem(resolutionText) {
    const resolutionItem = document.createElement('div');
    resolutionItem.classList.add('resolution-item');

    const resolutionHeader = document.createElement('div');
    resolutionHeader.classList.add('resolution-item-header');

    const icon = document.createElement('i');
    icon.classList.add('icon', 'fas', 'fa-comment-dots');
    resolutionHeader.appendChild(icon);

    const headerText = document.createElement('span');
    headerText.textContent = "Council's Statement:";
    resolutionHeader.appendChild(headerText);

    const text = document.createElement('p');
    text.classList.add('resolution-text');
    text.textContent = resolutionText;

    resolutionItem.appendChild(resolutionHeader);
    resolutionItem.appendChild(text);

    return resolutionItem;
}

function getTypeIcon(type) {
    return type === 'Dish' ? 'fa-utensils' : 'fa-question';
}

function humanReadableTime(timestamp) {
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    return date.toLocaleString();
}

function getInputValue(elementId) {
    return document.getElementById(elementId).value;
}

window.addEventListener('DOMContentLoaded', fetchSuggestions);
window.fetchSuggestions = fetchSuggestions;
