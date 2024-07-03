import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firebaseConfig } from './firebaseConfig.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', function () {
    onAuthStateChanged(auth, user => {
        if (user) {
            fetchSuggestions();
        } else {
            console.log('User not signed in');
        }
    });
});

async function fetchSuggestions() {
    const suggestionsCol = collection(db, 'suggestions');
    const suggestionSnapshot = await getDocs(suggestionsCol);
    const suggestions = suggestionSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    applyFilters(suggestions);
}

function applyFilters(suggestions) {
    const filterType = getInputValue('filter-type') || 'All';
    const filterStatus = getInputValue('filter-status') || 'All';
    const filteredSuggestions = suggestions.filter(suggestion =>
        (filterType === 'All' || suggestion.type === filterType) &&
        (filterStatus === 'All' || suggestion.status === filterStatus)
    );
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
    suggestions.sort((a, b) => b.time.seconds - a.time.seconds);
    const suggestionContainer = document.getElementById('suggestions-list');
    suggestions.forEach(suggestion => {
        const card = createSuggestionCard(suggestion);
        suggestionContainer.appendChild(card);
    });
}

function createSuggestionCard(suggestion) {
    const card = document.createElement('div');
    card.classList.add('suggestion-card', suggestion.status.toLowerCase());
    card.setAttribute('data-id', suggestion.id);

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
    title.style.textAlign = 'left';
    cardHeader.appendChild(title);

    const voteSection = document.createElement('div');
    voteSection.className = 'vote-section';
    const upvoteButton = createVoteButton('upvote', 'fas fa-thumbs-up', () => updateVotes(suggestion.id, true), suggestion.upvotedBy);
    const downvoteButton = createVoteButton('downvote', 'fas fa-thumbs-down', () => updateVotes(suggestion.id, false), suggestion.downvotedBy);
    const voteCount = document.createElement('span');
    voteCount.className = 'vote-count';
    voteCount.textContent = `Votes: ${suggestion.votes || 0}`;

    voteSection.append(upvoteButton, voteCount, downvoteButton);
    cardHeader.appendChild(voteSection);

    const expandButton = createExpandButton();
    cardHeader.appendChild(expandButton);

    return cardHeader;
}

function createVoteButton(className, iconClass, onClick, voteList) {
    const button = document.createElement('button');
    button.className = `vote-button ${className}`;
    button.innerHTML = `<i class="${iconClass}"></i>`;
    button.onclick = onClick;

    const suggestionId = button.closest('.suggestion-card') ? button.closest('.suggestion-card').getAttribute('data-id') : null;

    if (auth.currentUser && voteList.includes(auth.currentUser.email)) {
        button.disabled = true;
    }

    return button;
}

function createExpandButton() {
    const expandButton = document.createElement('button');
    expandButton.textContent = 'More Info';
    expandButton.classList.add('expand-button');
    expandButton.addEventListener('click', event => {
        const cardBody = event.target.closest('.suggestion-card').querySelector('.card-body');
        cardBody.classList.toggle('expanded');
        cardBody.style.display = cardBody.classList.contains('expanded') ? 'block' : 'none';
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

async function updateVotes(id, isUpvote) {
    const suggestionRef = doc(db, "suggestions", id);
    try {
        const suggestionDoc = await getDoc(suggestionRef);
        if (!suggestionDoc.exists()) {
            console.log("No such suggestion!");
            return;
        }
        const data = suggestionDoc.data();
        const increment = isUpvote ? 1 : -1;
        const updatedVotes = data.votes + increment;
        await updateDoc(suggestionRef, {
            votes: updatedVotes,
            upvotedBy: addOrRemove(data.upvotedBy, auth.currentUser.email, isUpvote),
            downvotedBy: addOrRemove(data.downvotedBy, auth.currentUser.email, !isUpvote)
        });

        document.querySelector(`[data-id="${id}"] .vote-count`).textContent = `Votes: ${updatedVotes}`;
        const buttonClass = isUpvote ? 'upvote' : 'downvote';
        document.querySelector(`[data-id="${id}"] .${buttonClass}`).disabled = true;

    } catch (error) {
        console.error('Error updating votes:', error);
    }
}

function addOrRemove(list, email, add) {
    const index = list.indexOf(email);
    if (add && index === -1) list.push(email);
    else if (!add && index !== -1) list.splice(index, 1);
    return list;
}

function getInputValue(elementId) {
    return document.getElementById(elementId).value;
}

window.addEventListener('DOMContentLoaded', fetchSuggestions);
window.fetchSuggestions = fetchSuggestions;
window.updateVotes = updateVotes;