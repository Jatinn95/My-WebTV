// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js';
import { getFirestore, collection, doc, addDoc, deleteDoc, getDocs, setDoc } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js';

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDBf46Ugsz-xgPNKfbB0oMlka6mMVyvr_4",
    authDomain: "my-webtv-4f53c.firebaseapp.com",
    projectId: "my-webtv-4f53c",
    storageBucket: "my-webtv-4f53c.firebasestorage.app",
    messagingSenderId: "68429807687",
    appId: "1:68429807687:web:449c27a4c8107f4fa9b162",
    measurementId: "G-J3QVRKZ71Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Handle authentication state changes.
function handleAuthState() {
    const usernameElement = document.getElementById('username');
    const signInButton = document.getElementById('signInButton');
    const signUpButton = document.getElementById('signUpButton');
    const dropdown = document.getElementById('dropdown');

    onAuthStateChanged(auth, (user) => {
        if (user) {
            usernameElement.textContent = `Welcome, ${user.displayName || 'User'}`;
            usernameElement.style.display = 'block';
            signInButton.style.display = 'none';
            signUpButton.style.display = 'none';
            dropdown.style.display = 'block';
            updateFavoritesUI();
        } else {
            usernameElement.style.display = 'none';
            signInButton.style.display = 'inline-block';
            signUpButton.style.display = 'inline-block';
            dropdown.style.display = 'none';
            clearFavoritesUI();
        }
    });
}

// Redirect to login page.
function redirectToLogin() {
    window.location.href = 'login.html';
}

// Redirect to signup page.
function redirectToSignup() {
    window.location.href = 'register.html';
}

// Logout functionality.
function logout() {
    signOut(auth)
        .then(() => {
            alert("You have been logged out.");
            window.location.href = 'index.html';
        })
        .catch(error => console.error("Error logging out:", error));
}

// Setup dropdown hover functionality.
function setupDropdown() {
    const usernameElement = document.getElementById('username');
    const dropdownElement = document.getElementById('dropdown');
    let hideDropdownTimeout;

    if (usernameElement && dropdownElement) {
        usernameElement.addEventListener('mouseover', () => {
            clearTimeout(hideDropdownTimeout);
            dropdownElement.style.display = 'block';
        });

        usernameElement.addEventListener('mouseout', () => {
            hideDropdownTimeout = setTimeout(() => {
                dropdownElement.style.display = 'none';
            }, 3000);
        });

        dropdownElement.addEventListener('mouseover', () => {
            clearTimeout(hideDropdownTimeout);
            dropdownElement.style.display = 'block';
        });

        dropdownElement.addEventListener('mouseout', () => {
            hideDropdownTimeout = setTimeout(() => {
                dropdownElement.style.display = 'none';
            }, 3000);
        });
    }
}

// Setup search functionality.
function setupSearch() {
    const searchBar = document.getElementById('searchBar');
    const noResultsMessage = document.getElementById('noResultsMessage');
    const videos = document.querySelectorAll('.video');

    if (searchBar) {
        searchBar.addEventListener('input', () => {
            const query = searchBar.value.toLowerCase().trim();
            let hasResults = false;

            videos.forEach(video => {
                const title = video.querySelector('h3').textContent.toLowerCase();
                if (title.includes(query)) {
                    video.style.display = 'block';
                    hasResults = true;
                } else {
                    video.style.display = 'none';
                }
            });

            noResultsMessage.style.display = hasResults ? 'none' : 'block';
        });
    }
}

// Toggle favorite status for a channel.
async function toggleFavorite(icon, channelId, channelName, channelImage) {
    const user = auth.currentUser;
    if (!user) {
        alert("Please sign in to save favorites!");
        return;
    }

    const favoritesRef = collection(doc(db, 'users', user.uid), 'favorites');
    const isFavorited = icon.classList.contains('active');

    try {
        if (isFavorited) {
            await deleteDoc(doc(favoritesRef, channelId));
            icon.classList.remove('active');
            icon.innerHTML = "&#9734;"; // Empty star
            alert("Removed from Favorites!");
        } else {
            await setDoc(doc(favoritesRef, channelId), {
                id: channelId,
                name: channelName,
                image: channelImage
            });
            icon.classList.add('active');
            icon.innerHTML = "&#9733;"; // Filled star
            alert("Added to Favorites!");
        }
        updateFavoritesUI();
    } catch (error) {
        console.error("Error updating favorites: ", error);
    }
}

// Update the UI for favorites section.
async function updateFavoritesUI() {
    const user = auth.currentUser;
    if (!user) return;

    const favoritesContainer = document.getElementById('favorites-container');
    const noFavoritesMessage = document.getElementById('noFavoritesMessage');
    const favoritesRef = collection(doc(db, 'users', user.uid), 'favorites');

    try {
        const snapshot = await getDocs(favoritesRef);
        favoritesContainer.innerHTML = ''; // Clear current favorites

        if (snapshot.empty) {
            noFavoritesMessage.style.display = 'block';
            return;
        }

        noFavoritesMessage.style.display = 'none';

        snapshot.forEach(doc => {
            const data = doc.data();
            const videoElement = document.createElement('div');
            videoElement.classList.add('video');
            videoElement.innerHTML = `
                <img src="${data.image}" alt="${data.name}">
                <h3>${data.name}</h3>
                <button onclick="openVideo('${data.url || '#'}', '${data.name}')">Play</button>
                <i class="favorite-icon active" onclick="toggleFavorite(this, '${data.id}', '${data.name}', '${data.image}')">&#9733;</i>
            `;
            favoritesContainer.appendChild(videoElement);
        });
    } catch (error) {
        console.error("Error fetching favorites: ", error);
    }
}

// Clear the favorites UI.
function clearFavoritesUI() {
    const favoritesContainer = document.getElementById('favorites-container');
    const noFavoritesMessage = document.getElementById('noFavoritesMessage');
    favoritesContainer.innerHTML = '';
    noFavoritesMessage.style.display = 'block';
}

// Open Video Function
function openVideo(videoUrl, videoName = 'Video') {
    const playerUrl = `PLAY.html?video=${encodeURIComponent(videoUrl)}&name=${encodeURIComponent(videoName)}`;
    window.location.href = playerUrl;
}

// Video Navigation Logic (Next/Previous buttons)
document.getElementById('prevVideo').addEventListener('click', () => {
    // Implement logic to go to previous video
    console.log("Previous video clicked");
});

document.getElementById('nextVideo').addEventListener('click', () => {
    // Implement logic to go to next video
    console.log("Next video clicked");
});

// Initialize the application.
document.addEventListener('DOMContentLoaded', () => {
    handleAuthState();
    setupDropdown();
    setupSearch();
});