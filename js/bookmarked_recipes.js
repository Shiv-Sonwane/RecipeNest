// Import Firebase app, auth, Firestore modules, and Firebase configuration
import { auth, db } from "/UNIT-3 async/Build_Week_Project/js/config.js";
import {
    onAuthStateChanged,
    signOut,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
    collection,
    onSnapshot,
    query,
    orderBy,
    addDoc,
    doc,
    setDoc,
    getDoc,
    deleteDoc,
    serverTimestamp,
    updateDoc,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Get DOM elements for recipe list and logout button
const allList = document.getElementById("all-recipe-list");
const logoutBtn = document.getElementById("logoutBtn");

let unsubscribeBookmarks = null; // Store the Firestore snapshot listener

// Monitor authentication state
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // Redirect to login if not authenticated
        console.log("No user authenticated, redirecting to login.");
        window.location.href = "/UNIT-3 async/Build_Week_Project/html/index.html";
    } else {
        console.log("User authenticated:", user.uid, user.email);
        loadBookmarkedRecipes(user); // Load bookmarked recipes
    }
});

// Load and display bookmarked recipes
async function loadBookmarkedRecipes(user) {
    console.log("Fetching bookmarked recipes...");
    // Unsubscribe from previous listener to prevent duplicates
    if (unsubscribeBookmarks) {
        unsubscribeBookmarks();
    }

    const bookmarkCol = collection(db, "users", user.uid, "bookmarks");
    unsubscribeBookmarks = onSnapshot(bookmarkCol, async (bookmarkSnap) => {
        allList.innerHTML = ""; // Clear the recipe list
        if (bookmarkSnap.empty) {
            console.log("No bookmarked recipes found.");
            allList.innerHTML = "<p>No bookmarked recipes yet.</p>";
            return;
        }

        for (const bookmarkDoc of bookmarkSnap.docs) {
            const recipeId = bookmarkDoc.data().recipeId;
            const recipeRef = doc(db, "recipes", recipeId);
            const docSnap = await getDoc(recipeRef);
            if (!docSnap.exists()) continue;

            const data = docSnap.data();
            console.log("Processing bookmarked recipe:", docSnap.id, data.title, "by user:", data.userId);

            // Ensure all fields have defaults
            const recipe = {
                title: data.title || "Untitled Recipe",
                ingredients: data.ingredients || "No ingredients provided",
                instructions: data.instructions || "No instructions provided",
                category: data.category || "Uncategorized",
                tags: Array.isArray(data.tags) ? data.tags : [],
                videoUrl: data.videoUrl || "",
                username: data.username || data.userEmail || "Anonymous",
                userId: data.userId || "unknown",
                likes: data.likes || 0,
            };

            // Since it's bookmarked, isBookmarked = true
            const isBookmarked = true;

            // Check if recipe is liked by the user
            const likeRef = doc(db, "users", user.uid, "likes", docSnap.id);
            const likeSnap = await getDoc(likeRef).catch((error) => {
                console.error("Error checking like:", error);
                return { exists: () => false };
            });
            const isLiked = likeSnap.exists();

            // Check if recipe belongs to the current user
            const isOwnRecipe = data.userId === user.uid;

            // Create recipe card
            const card = document.createElement("div");
            card.classList.add("recipe-card");
            card.setAttribute("data-id", docSnap.id); // Add recipe ID for updates

            // Populate card HTML
            card.innerHTML = `
                <h3>${escapeHTML(recipe.title)}</h3>
                <p><strong>Ingredients:</strong> <span class="ingredients">${escapeHTML(recipe.ingredients)}</span></p>
                <div class="instructions">${recipe.instructions}</div>
                <p><strong>Category:</strong> ${escapeHTML(recipe.category)}</p>
                <p><strong>Tags:</strong> ${recipe.tags.length ? recipe.tags.map(tag => escapeHTML(tag)).join(", ") : "None"}</p>
                ${recipe.videoUrl ? `<p><a href="${recipe.videoUrl}" target="_blank">Watch Video</a></p>` : ""}
                <p><strong>Likes:</strong> <span class="like-count">${recipe.likes}</span> <button class="like-btn" data-id="${docSnap.id}">${isLiked ? "Unlike" : "Like"}</button></p>
                <small>👨‍🍳 ${escapeHTML(recipe.username)} ${isOwnRecipe ? "(You)" : ""}</small>
                <div>
                    <button class="bookmark-btn" data-id="${docSnap.id}">Unbookmark</button>
                </div>
                <div class="comments">
                    <h4>Comments</h4>
                    <ul class="comment-list" data-id="${docSnap.id}"></ul>
                    <form class="comment-form" data-id="${docSnap.id}">
                        <input type="text" class="comment-input" placeholder="Add a comment" required>
                        <button type="submit">Post</button>
                    </form>
                </div>
            `;
            allList.appendChild(card);

            // Load comments for the recipe
            loadComments(docSnap.id, card.querySelector(".comment-list"));

            // Handle bookmark button click (unbookmark since it's bookmarked page)
            card.querySelector(".bookmark-btn").addEventListener("click", async () => {
                if (!user) {
                    alert("Please log in to manage bookmarks.");
                    window.location.href = "/UNIT-3 async/Build_Week_Project/html/index.html";
                    return;
                }
                try {
                    const recipeId = docSnap.id;
                    const bookmarkRef = doc(db, "users", user.uid, "bookmarks", recipeId);
                    await deleteDoc(bookmarkRef);
                    console.log("Bookmark removed for recipe:", recipeId);
                    // Remove card from view
                    card.remove();
                } catch (error) {
                    console.error("Error removing bookmark:", error);
                    alert("Failed to remove bookmark: " + error.message);
                }
            });

            // Handle like button click
            card.querySelector(".like-btn").addEventListener("click", async () => {
                if (!user) {
                    alert("Please log in to like recipes.");
                    window.location.href = "/UNIT-3 async/Build_Week_Project/html/index.html";
                    return;
                }
                try {
                    const recipeId = docSnap.id;
                    const recipeRef = doc(db, "recipes", recipeId);
                    const likeCard = allList.querySelector(`.recipe-card[data-id="${recipeId}"]`);
                    const likeBtn = likeCard.querySelector(".like-btn");
                    const likeCountSpan = likeCard.querySelector(".like-count");
                    const currentLikes = parseInt(likeCountSpan.textContent);
                    if (isLiked) {
                        await deleteDoc(likeRef);
                        await updateDoc(recipeRef, { likes: currentLikes - 1 });
                        console.log("Like removed for recipe:", recipeId);
                        likeBtn.textContent = "Like";
                        likeCountSpan.textContent = currentLikes - 1;
                    } else {
                        await setDoc(likeRef, { recipeId, createdAt: serverTimestamp() });
                        await updateDoc(recipeRef, { likes: currentLikes + 1 });
                        console.log("Like added for recipe:", recipeId);
                        likeBtn.textContent = "Unlike";
                        likeCountSpan.textContent = currentLikes + 1;
                    }
                } catch (error) {
                    console.error("Error updating like:", error);
                    alert("Failed to update like: " + error.message);
                }
            });

            // Handle comment form submission
            card.querySelector(".comment-form").addEventListener("submit", async (e) => {
                e.preventDefault();
                if (!user) {
                    alert("Please log in to add comments.");
                    window.location.href = "/UNIT-3 async/Build_Week_Project/html/index.html";
                    return;
                }
                const commentInput = e.target.querySelector(".comment-input");
                const commentText = commentInput.value.trim();
                if (!commentText) return;

                try {
                    await addDoc(collection(db, "recipes", docSnap.id, "comments"), {
                        userId: user.uid,
                        username: user.displayName || user.email,
                        text: commentText,
                        createdAt: serverTimestamp(),
                    });
                    commentInput.value = "";
                    console.log("Comment added successfully for recipe:", docSnap.id);
                } catch (error) {
                    console.error("Error adding comment:", error);
                    alert("Error adding comment: " + error.message);
                }
            });
        }
    }, (error) => {
        console.error("Error fetching bookmarks:", error);
        allList.innerHTML = "<p>Error loading bookmarked recipes. Please try again.</p>";
    });
}

// Load and display comments for a recipe
function loadComments(recipeId, commentList) {
    // Query comments for the recipe, ordered by creation date
    const q = query(collection(db, "recipes", recipeId, "comments"), orderBy("createdAt", "desc"));
    onSnapshot(q, (snap) => {
        commentList.innerHTML = "";
        if (snap.empty) {
            commentList.innerHTML = "<li>No comments yet.</li>";
        }
        snap.forEach((docSnap) => {
            const comment = docSnap.data();
            const li = document.createElement("li");
            li.innerHTML = `<strong>${escapeHTML(comment.username || "Anonymous")}:</strong> ${escapeHTML(comment.text)}`;
            commentList.appendChild(li);
        });
    }, (error) => {
        console.error("Error loading comments for recipe", recipeId, ":", error);
        commentList.innerHTML = "<li>Error loading comments.</li>";
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