import { auth, db } from "/UNIT-3 async/Build_Week_Project/js/config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { collection, addDoc, doc, updateDoc, serverTimestamp, getDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
        toolbar: [
            ['bold', 'italic', 'underline'],
            ['link', 'image'],
            [{ list: 'ordered' }, { list: 'bullet' }]
        ]
    }
});

let currentUser = null;

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        // Check for edit param
        const urlParams = new URLSearchParams(window.location.search);
        const editId = urlParams.get('edit');
        if (editId) {
            const recipeRef = doc(db, "recipes", editId);
            getDoc(recipeRef).then((docSnap) => {
                if (docSnap.exists()) {
                    const recipe = docSnap.data();
                    document.getElementById('title').value = recipe.title;
                    quill.root.innerHTML = recipe.instructions;
                    document.getElementById('ingredients').value = recipe.ingredients;
                    document.getElementById('tags').value = recipe.tags?.join(', ') || '';
                    document.getElementById('category').value = recipe.category;
                    document.getElementById('videoUrl').value = recipe.videoUrl || '';
                    document.getElementById('recipeId').value = editId;
                    document.getElementById('formTitle').textContent = "Edit Recipe";
                    document.getElementById('submitBtn').textContent = "Update Recipe";
                } else {
                    alert("Recipe not found!");
                }
            }).catch(error => {
                console.error("Error loading recipe:", error);
            });
        }
    } else {
        window.location.href = '/UNIT-3 async/Build_Week_Project/html/index.html';
    }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = '/UNIT-3 async/Build_Week_Project/html/index.html';
    });
});

document.getElementById('recipeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value.trim();
    const instructions = quill.root.innerHTML;
    const ingredients = document.getElementById('ingredients').value.trim();
    const tags = document.getElementById('tags').value.trim().split(",").map(tag => tag.trim()).filter(tag => tag);
    const category = document.getElementById('category').value;
    const videoUrl = document.getElementById('videoUrl').value.trim();
    const recipeId = document.getElementById('recipeId').value;

    // Validate required fields
    if (!title || !instructions || !ingredients || !category) {
        alert("Please fill all required fields!");
        return;
    }

    const recipeData = {
        title,
        instructions,
        ingredients,
        tags,
        category,
        videoUrl,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        username: currentUser.displayName || currentUser.email,
        createdAt: serverTimestamp()
    };

    try {
        if (recipeId) {
            const recipeRef = doc(db, "recipes", recipeId);
            await updateDoc(recipeRef, {
                ...recipeData,
                updatedAt: serverTimestamp(),
            });
            alert("Recipe updated successfully!");
        } else {
            await addDoc(collection(db, "recipes"), recipeData);
            alert("Recipe added successfully!");
        }
        // Reset form
        document.getElementById('recipeForm').reset();
        quill.root.innerHTML = "";
        document.getElementById('recipeId').value = "";
        document.getElementById('formTitle').textContent = "Add a New Recipe";
        document.getElementById('submitBtn').textContent = "Add Recipe";
    } catch (error) {
        console.error("Error adding/updating recipe: ", error);
        alert("Error saving recipe: " + error.message);
    }
});