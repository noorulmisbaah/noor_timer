/**
 * Copyright Noorul Misbah 2024-present. All rights reserved.
 */
 
 window.addEventListener('resize', () => {
    if (window.innerWidth > 900)
        menuItemsSection.style.display = 'block';
    else if (window.innerWidth <= 900 && !optionSelected)
        menuItemsSection.style.display = 'block';
    else {
        itemsDetailsSection.style.display = 'block';
        menuItemsSection.style.display = 'none';
    }
 });

 /**
  * Shows or hides the application menu
  * @function toggleMenu
  * @param {String} state 
  * @description toggleMenu function shows or hides the menu. As the function argument, 'open' or 'close' is passed to open or close the menu respectively.
  */

function toggleMenu(state) {
    if (state === 'open') {
        menu.style.opacity = 1;
        menu.style.zIndex = 1;
    } else if (state === 'close') {
        menu.style.opacity = 0;
        menu.style.zIndex = -1;
    } else {
        return;
    }
}

/**
 * Show the menu details
 * @function showMenuDetails
 * @param {Array} details
 * @description To show the menu details, a menu option is clicked which in turn triggers this function. 
 * It ensures that only one detail is shown while the others remain hidden.
 */
function showMenuDetails(details) {
    menuDetails.forEach(menu => {
        menu.style.display = 'none';
    });

    details.style.display = 'block';

    if (window.innerWidth <= 900) {
        menuItemsSection.style.display = 'none';
        itemsDetailsSection.style.display = 'block';
    } else
        itemsDetailsSection.style.display = 'block';
}

/**
 * Shows the comment box and submit button
 * @function showCommentFields
 * @description The text area for adding a comment and the submit button are displayed when the showCommentFields 
 * function is called.
 */
function showCommentFields() {
    commentArea = document.querySelector('.comment-area').style.display = 'flex';
    submitCommentButton = document.querySelector('.submit-post-button');
    makePostButton.style.display = 'none';
    submitCommentButton.addEventListener('click', () => {
        submitComment();
    });
}

/**
 * Submits the comment
 * @function submitComment
 * @description The submitComment function extacts the text in the comment text area when the 'Send' button is 
 * clicked and then send the comment. No comment will be sent if the comment text area is empty or the comment already exists.
 */
function submitComment() {
    const commentTextArea = document.getElementById('post-text-area');
    const comment = commentTextArea.value;
    const author = currentUsernameText.innerText;
    const date = new Date().toDateString();

    if ((!comment))
        showNotificationBox('Empty Comment', 'We can\'t send an empty comment. Enter your comment and try sending again.');
    else {
        fetch('add_comment', {
            body: JSON.stringify({ comment, author, date }),
            headers: { 'Content-Type': 'application/json' },
            method: 'POST'
        }).catch(err => console.log(err));
    }
}

/**
 * Updates the account information of the user
 * @function updateAccountButton
 * @description The updateAccountInformation function updates the user information. The update will fail if the user used
 * a username or email that already exists.
 */
function updateAccountInformation() {
    const currentUsername = currentUsernameText.innerText.toLowerCase();
    const currentPassword = currentPasswordField.value;
    const currentUsermail = currentUsermailText.innerText;
    const newUsername = newUsernameField.value.toLowerCase();
    const newUsermail = newUsermailField.value;
    const newPassword = newPasswordField.value;
    const submitFormButton = document.querySelector('button[type="submit"]');

    if ((currentPassword && !newPassword) || (!currentPassword && newPassword))
        showNotificationBox('Update Failed', 'If you want to change your password, you need to provide the old one and the new one.');
    else {
        fetch('update_information', {
            body: JSON.stringify({ currentUsername, currentPassword, currentUsermail, newUsername, newUsermail, newPassword }),
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        }).then(res => res.json()).then(({ passwordMismatch, updated, userExists }) => {
            if (userExists)
                showNotificationBox('Update Failed', 'The update failed because a conflict has been detected. This happens if the new username or email matches with an existing one.');
            else if (passwordMismatch)
                showNotificationBox('Password Mismatch', 'The password is not updated because a password mismatch has been detected.');
            else if (updated)
                submitFormButton.click();
            else
                alert('Unknown error.')
        }).catch(err => console.error(err));
    }
}

/**
 * Deletes the user account
 * @function deleteAccount
 * @description This deletes the user account.
 */
function deleteAccount() {
    const username = currentUsernameText.innerText.toLowerCase();

    fetch('delete_account', {
        body: JSON.stringify({ username }),
        headers: { 'Content-Type': 'application/json' },
        method: 'DELETE'
    }).then(res => res.json()).then(({ deleted }) => {
        if (deleted)
            confirmDeleted.click();
        else {
            alert('Server error');
        }
    }).catch(err => console.error(err));
}

const confirmDeleted = document.querySelector('[delete-account-button]');
const menu = document.querySelector('.menu');
const menuItemsSection = document.querySelector('.menu-items');
const itemsDetailsSection = document.querySelector('.items-details');
const backButton = document.querySelector('.back-button');
const menuIcon = document.querySelector('.menu-icon');
const closeMenuIcon = document.querySelector('.menu-x');
const menuItems = document.querySelectorAll('.menu-item');
const menuDetails = document.querySelectorAll('.details');
const makePostButton = document.querySelector('.make-post-button');
const currentUsernameText = document.querySelector('[username]');
const currentUsermailText = document.querySelector('[usermail]');
const updateAccountButton = document.querySelector('.update-account-button');
const deleteAccountButton = document.querySelector('.delete-account-button');
const newUsernameField = document.getElementById('username');
const newUsermailField = document.getElementById('email');
const newPasswordField = document.getElementById('new-password');
const currentPasswordField = document.getElementById('current-password');
var submitCommentButton;
var commentArea;
var optionSelected = false;

menuIcon.addEventListener('click', () => {
    toggleMenu('open');
});
closeMenuIcon.addEventListener('click', () => {
    toggleMenu('close');
});

menuItems.forEach((menuItem, index) => {
    menuItem.addEventListener('click', () => {
        showMenuDetails(menuDetails[index]);
        optionSelected = true;
    });
});

makePostButton.addEventListener('click', () => {
    showCommentFields();
});

updateAccountButton.addEventListener('click', () => {
    updateAccountInformation();
});

backButton.addEventListener('click', () => {
    menuItemsSection.style.display = 'block';
    itemsDetailsSection.style.display = 'none';
    optionSelected = false;
});

deleteAccountButton.addEventListener('click', () => {
    showConfirmationBox('Remove Account?', 'This operation will remove your Noor Timer account. All your timers will be lost. Are sure you want to proceed?', deleteAccount);
});