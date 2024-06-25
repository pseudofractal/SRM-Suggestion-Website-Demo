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
        const card = document.createElement('div');
        card.classList.add('card');

        const title = document.createElement('p');
        title.innerHTML = `<strong>${suggestion.suggestion}</strong>`;
        card.appendChild(title);

        const time = document.createElement('p');
        time.innerHTML = `<span class="icon time-icon"></span> ${suggestion.time}`;
        card.appendChild(time);

        const status = document.createElement('p');
        status.innerHTML = `<span class="icon status-icon ${suggestion.status}"></span> ${suggestion.status}`;
        card.appendChild(status);

        const type = document.createElement('p');
        type.innerHTML = `<span class="icon type-icon"></span> ${suggestion.type}`;
        card.appendChild(type);

        const resolution = document.createElement('p');
        resolution.innerHTML = `<span class="icon comments-icon"></span> ${suggestion.resolution}`;
        card.appendChild(resolution);

        suggestionContainer.appendChild(card);
    });
}

window.addEventListener('DOMContentLoaded', fetchSuggestions);