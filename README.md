# RecipeNest 🍲

## Introduction

**RecipeNest** is a community-driven recipe sharing platform where users can add, view, bookmark, and manage recipes.  
The goal is to create a simple and engaging place for food enthusiasts to store their recipes, browse others’ creations, and keep a collection of their favorites.

The application is powered by **Firebase** for authentication and Firestore database.  
It is built entirely with **HTML, CSS, and JavaScript** on the frontend.

## Project Type

Frontend (Firebase-powered)

## Deployed App

Frontend: [RecipeNest](https://recipes-nest74.netlify.app/)  
Backend: Firebase Authentication + Firestore Database (serverless)  
Database: Firebase Firestore

## Directory Structure
```text
RecipeSharingPlatform_Food/
├─ assets/ # Images, logo, icons
├─ css/ # All stylesheets
│ ├─ main.css
│ ├─ auth.css
│ ├─ recipe-display.css
│ ├─ recipe-form.css
├─ js/ # Application logic
│ ├─ auth.js # Firebase authentication (login/signup/logout)
│ ├─ config.js # Firebase configuration
│ ├─ dashboard.js # Dashboard script
│ ├─ add_recipe.js # Add recipe functionality
│ ├─ all_recipes.js # Display all recipes
│ ├─ bookmarked_recipes.js # Bookmarked recipes handling
├─ html/ # HTML pages
│ ├─ index.html # Login page
│ ├─ signup.html # Signup page
│ ├─ dashboard.html # Dashboard (My Recipes)
│ ├─ add_recipe.html # Add a new recipe
│ ├─ all_recipes.html # View all recipes
│ ├─ bookmarked_recipes.html # View bookmarked recipes

```


## Features

- **User Authentication** (Signup/Login/Logout via Firebase)
- **Create Recipes** with title, ingredients, instructions, and images
- **View Recipes** in a clean card-based layout
- **Bookmark Recipes** to save favorites
- **Delete Recipes** from "My Recipes"
- **Comment Section** on recipes
- **Responsive UI** for mobile and desktop

## Design decisions or assumptions

- Used **Firebase** to avoid backend complexity and keep it serverless.
- Each user has their own recipes, but can view global recipes.
- Bookmark feature is user-specific and stored separately in Firestore.
- Minimalistic UI for simplicity and faster loading.

## Installation & Getting started

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/recipenest.git
   cd recipenest
   ```
2. Open config.js and replace Firebase config values with your Firebase
   project credentials.
3. Start a local server (using VS Code Live Server or any HTTP server):
   npx live-server
4. Open the app in your browser.

## Usage

- Register a new account or login with existing credentials.
- Add recipes with name, ingredients, and instructions.
- Browse all recipes under All Recipes.
- Bookmark recipes and view them in the Bookmarked Recipes section.

## Example Workflow

# Login → Add Recipe → Bookmark Recipe → View in Bookmarked Recipes

## Credentials

For demo purposes, you can use test credentials:

- email :- ramu@example.com
- password :- 123456

(or create a new account with signup)

## APIs Used

**Firebase Authentication** – User signup/login/logout
**Firebase Firestore** – Store recipes, bookmarks, and comments
**Firebase Hosting** (optional) – Deploy frontend

## Technology Stack

**HTML5** – Structure
**CSS3** – Styling (main.css, recipe-display.css, recipe-form.css, auth.css)
**JavaScript(ES6)** – Core logic
**Firebase** – Auth & Firestore database
**Responsive Design**– Mobile-first approach
