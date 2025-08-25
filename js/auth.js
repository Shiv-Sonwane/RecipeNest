import { auth } from "/UNIT-3 async/Build_Week_Project/js/config.js";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    window.location.href = '/UNIT-3 async/Build_Week_Project/html/dashboard.html';
                })
                .catch((error) => {
                    alert('Login failed: ' + error.message);
                });
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;

            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Update profile with email as display name (since no username field)
                    return updateProfile(userCredential.user, { displayName: email.split('@')[0] })
                        .then(() => userCredential);
                })
                .then((userCredential) => {
                    window.location.href = '/UNIT-3 async/Build_Week_Project/html/dashboard.html';
                })
                .catch((error) => {
                    alert('Signup failed: ' + error.message);
                });
        });
    }
});