/**
 * Copyright Noorul Misbah 2024-present. All rights reserved.
 * Author: Aminu Adamu Aminu
 */

window.addEventListener('resize', () => {
    if (window.innerWidth > 600)
        formOptionsContent.style.display = 'flex';
    if (window.innerWidth <= 600 && optionSelected)
        formOptionsContent.style.display = 'none';
    else {
        formOptionsContent.style.display = 'flex';
    }
});

async function login() {
    try {
        const username = loginUsernameField.value.toLowerCase();
        const password = loginPasswordField.value;
        const objects = { method: 'POST', body: JSON.stringify({ username, password }), headers: { 'Content-Type': 'application/json' } };

        if ((!username) || (!password))
            showNotificationBox('Invalid Entry', 'Looks like you did not fill some fields. All fields are required to be filled.');
        else {
            const response = await fetch('login', objects);
            const { exists, wrongPassword } = await response.json();
    
            if (!exists)
                showNotificationBox('Unknown User', 'The username you entered could not be found. Check the username and try again.');
            else if (wrongPassword)
                showNotificationBox('Incorrect Password', 'The password you entered is incorrect. Unfortunately, we can\'t sign you in with an incorrect password.');
            else {
                submitUsernameField.value = username.toLowerCase();
                submitLoginButton.click();
            }
        }
    } catch (error) {
        console.error(error);
    }
}

async function sigup() {
    try {
        const username = signupUsernameField.value.toLowerCase();
        const usermail = signupEmailField.value;
        const password = signupPasswordField.value;
        const confirmPassword = sigunupConfirmPasswordField.value;
        const date = new Date().toDateString();
        const fetchObjects = { method: 'POST', body: JSON.stringify({ username, usermail, password, date }), headers: { 'Content-Type': 'application/json' } };

        if ((!username) || (!password) || (!usermail) || (!confirmPassword))
            showNotificationBox('Invalid Entry', 'To create an account, you need to provide a username, an email, and a password. We can\'t create an account for you without any of them.');
        else if (password !== confirmPassword)
            showNotificationBox('Password Mismatch', 'The passwords do not match.');
        else {
            const response = await fetch('create_account', fetchObjects);
            const { userExists, registered } = await response.json();

            if (userExists)
                showNotificationBox('Registration Failed', 'Your account was not created because a user is already having an account with a username or email the same with the one you provided.');
            else if (registered)
                showNotificationBox('Account Created', 'Your account has been created successfully. Use your username and password to log in. Enjoy Noor Timer.');
            else
                showNotificationBox('Error', 'We\'re sorry, an unknown error has occured. Try again.');
        }
    } catch (error) {
        console.error(error);
    }
}

function recoverAccount() {
    const usermail = recoveryEmail.value;
    const fetchObjects = { body: JSON.stringify({ usermail}), method: 'POST', headers: { 'Content-Type': 'application/json' } };

    fetch('recover_account', fetchObjects).then(res => res.json()).then(({ sent,found }) => {
        if (!found)
            showNotificationBox('Email not Found', 'The email you provided is not found in our records. Make sure it is the email that you used to create an account with Noor Timer.');
        else if (!sent)
            showNotificationBox('Sending Failed', 'The email could not be sent because an error has occured.');
        else if (sent)
            showNotificationBox('Email Sent', 'An email has been sent with your account details. Check the email and log in with the details of your account.');
    }).catch(err => console.error(err));
}

function showFormInput(index) {
    formInputs.forEach(input => {
        input.style.display = 'none';
    });

    if (window.innerWidth <= 600)
        formOptionsContent.style.display = 'none';
    formInputs[index].style.display = 'flex';
    form.style.flexDirection = 'row';
}

const form = document.querySelector('.form');
const formOptionsContent = document.querySelector('.form-options');
const formInputs = document.querySelectorAll('.form-inputs');
const formOptions = document.querySelectorAll('.option');
const backButtons = document.querySelectorAll('.back-button');
const loginButton = document.querySelector('[login-button]');
const signupButton = document.querySelector('[sigup-button]');
const recoveryButton = document.querySelector('[recovery-button]');
const submitLoginButton = document.querySelector('#login-form button');
const submitUsernameField = document.querySelector("#login-form input");
const loginUsernameField = document.getElementById('login-username');
const loginPasswordField = document.getElementById('login-password');
const signupUsernameField = document.getElementById('signup-username');
const signupPasswordField = document.getElementById('signup-password');
const sigunupConfirmPasswordField = document.getElementById('confirm-password');
const signupEmailField = document.getElementById('email');
const recoveryEmail = document.getElementById('recovery-email');
var optionSelected = false;

formOptions.forEach((option, index) => {
    option.addEventListener('click', () => {
        showFormInput(index);
        optionSelected = true;
    });
});

loginButton.addEventListener('click', () => {
    login();
});

signupButton.addEventListener('click', () => {
    sigup();
});

recoveryButton.addEventListener('click', () => {
    recoverAccount();
});

backButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        formInputs[index].style.display = 'none';
        formOptionsContent.style.display = 'flex';
        optionSelected = false;
    });
});