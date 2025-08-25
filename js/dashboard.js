// Import Firebase app, auth, and Firestore modules, and Firebase configuration
import { auth, db } from "/UNIT-3 async/Build_Week_Project/js/config.js";
import {
    collection,
    query,
    where,
    onSnapshot,
    deleteDoc,
    doc,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import {
    onAuthStateChanged,
    signOut,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// Get DOM elements for recipe form and list
const recipeList = document.getElementById("recipe-list");
const logoutBtn = document.getElementById("logoutBtn");

let currentUser = null;



// Monitor authentication state
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // Redirect to login if not authenticated
        window.location.href = "/UNIT-3 async/Build_Week_Project/html/index.html";
    } else {
        currentUser = user; // Store current user
        loadMyRecipes(); // Load user's recipes
    }
});

// Load and display user's recipes
function loadMyRecipes() {
    recipeList.innerHTML = "<p>Loading...</p>";

    // Query recipes for the current user
    const q = query(collection(db, "recipes"), where("userId", "==", currentUser.uid));
    onSnapshot(q, (snapshot) => {
        recipeList.innerHTML = "";
        if (snapshot.empty) {
            recipeList.innerHTML = "<p>No recipes yet.</p>";
            return;
        }

        // Iterate through user's recipes
        snapshot.forEach((docSnap) => {
            const recipe = docSnap.data();
            const card = document.createElement("div");
            card.classList.add("recipe-card");

            // Create recipe card HTML
            card.innerHTML = `
                <h3>${escapeHTML(recipe.title)}</h3>
                <p><strong>Ingredients:</strong> ${escapeHTML(recipe.ingredients)}</p>
                <div class="instructions">${recipe.instructions}</div>
                <p><strong>Category:</strong> ${escapeHTML(recipe.category)}</p>
                <p><strong>Tags:</strong> ${recipe.tags?.length ? recipe.tags.map(tag => escapeHTML(tag)).join(", ") : "None"}</p>
                ${recipe.videoUrl ? `<p><a href="${recipe.videoUrl}" target="_blank">Watch Video</a></p>` : ""}
                <small>👨‍🍳 ${escapeHTML(recipe.username)}</small><br>
                <a href="/UNIT-3 async/Build_Week_Project/html/add_recipe.html?edit=${docSnap.id}" class="edit-btn">Edit</a>
                <button class="delete-btn" data-id="${docSnap.id}">Delete</button>
            `;

            recipeList.appendChild(card);

            // Handle delete button click
            card.querySelector(".delete-btn").addEventListener("click", async () => {
                try {
                    await deleteDoc(doc(db, "recipes", docSnap.id));
                    console.log("Recipe deleted:", docSnap.id);
                } catch (error) {
                    console.error("Error deleting recipe:", error);
                    alert("Failed to delete recipe: " + error.message);
                }
            });
        });
    }, (error) => {
        console.error("Error loading recipes:", error);
        alert("Failed to load your recipes: " + error.message);
    });
}

// Escape HTML to prevent XSS attacks
function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, (m) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[m]));
}

// Handle logout
logoutBtn.addEventListener("click", () => signOut(auth));