/**
 * Project Name: Notification Box
 * Author: Aminu Adamu Aminu
 * Version: 1.3.0
 * Last Updated: 18th January, 2024 
 * 
 * Copyright 2023 Noorul Misbah
 */

/**
 * Creates the notification box content
 * 
 * @function createNotificationBox
 * @description createNotificationBox function creates the content of the box.
 */
function createNotificationBox() {
    boxContainer.setAttribute('id', 'notification-box-container');
    boxTitle.setAttribute('class', 'box-title');
    boxContent.setAttribute('class', 'box-content');
    closeButton.setAttribute('class', 'box-button');
    acceptButton.setAttribute('class', 'box-button');
    rejectButton.setAttribute('class', 'box-button');
    pageOverlay.setAttribute('id', 'page-overlay');
    buttonSet.setAttribute('id', 'button-set');

    buttonSet.appendChild(acceptButton);
    buttonSet.appendChild(rejectButton);
    boxContainer.appendChild(boxTitle);
    boxContainer.appendChild(boxContent);
    boxContainer.appendChild(closeButton);
    boxContainer.appendChild(buttonSet);
    pageOverlay.appendChild(boxContainer);
    pageBody.appendChild(pageOverlay);
}

/**
 * Shows a notification
 * @function showNotificationBox
 * @param {String} title 
 * @param {String} content
 * @description Shows a notification to the user.
 */
function showNotificationBox(title, content) {
    closeButton.innerText = 'Close';
    closeButton.style.display = 'inline';
    acceptButton.style.display = rejectButton.style.display = 'none';
    boxTitle.innerText = title || 'Notification';
    boxContent.innerText = content || ' ';

    closeButton.addEventListener('click', () => {
        closeBox();
    });

    openBox();
}

/**
 * Shows a confirmation
 * @function showConfirmationBox
 * @param {String} title 
 * @param {String} content 
 * @param {Function} func
 * @description Accepts three arguments—the box title, the content, and a function to execute if the 'Yes' button is clicked.
 */
function showConfirmationBox(title, content, func) {
    requestStatus = false;
    acceptButton.innerText = 'Yes';
    rejectButton.innerText = 'No';
    closeButton.style.display = 'none';
    acceptButton.style.display = rejectButton.style.display = 'inline';
    boxTitle.innerText = title || 'Notification';
    boxContent.innerText = content || '';


    acceptButton.addEventListener('click', () => {
        func();
        closeBox();
    });
    
    rejectButton.addEventListener('click', () => {
        closeBox();
    });

    openBox();
}

function openBox() {
    pageOverlay.style.opacity = boxContainer.style.opacity = 1;
    pageOverlay.style.zIndex = boxContainer.style.zIndex = 1;
}

function closeBox() {
    pageOverlay.style.opacity = boxContainer.style.opacity = 0;
    pageOverlay.style.zIndex = boxContainer.style.zIndex = -1;
    closeButton.style.display = acceptButton.style.display = rejectButton.style.display = 'none';
}

const boxContainer = document.createElement('div');
const buttonSet = document.createElement('div');
const boxTitle = document.createElement('p');
const boxContent = document.createElement('p');
const closeButton = document.createElement('button');
const acceptButton = document.createElement('button');
const rejectButton = document.createElement('button');
const pageOverlay = document.createElement('div');
const pageBody = document.querySelector('body');

createNotificationBox();