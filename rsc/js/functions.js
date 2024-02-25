/**
 * Copyright Noorul Misbah 2024-present. All rights reserved.
 */

/**
 * Updates the original items on the server
 * 
 * @function uploadUpdates
 * @param {Array} items The array of items to be sent to the server.
 * @return {Boolean} Returns true if the update is successful
 * @description
 * This function is called when changes are made—when an item is updated, added, or removed. It uploads the updated data, passed as the
 * function argument, to the server. 
 */
 async function uploadUpdates(items) {
    if (!(items) || (items.length < 0) || !(Array.isArray(items)))
        throw new Error('Invalid data.');
    try {
        const user = document.querySelector('.username').innerText;
        const info = {
            body: JSON.stringify({user, items}),
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        };

        var response = await fetch('update_data', info);
        var { updated } = await response.json();

        console.log(updated);
    } catch(error) {
        throw new Error(error);
    }
}

/**
 * Converts time in milliseconds to human readable time
 * 
 * @function toReadableTimeString
 * @param {Number} milliseconds 
 * @returns {String} Returns time in hh:mm:ss format
 * @description toReadableTimeString function accepts time in milliseconds as its argument and returns its equivalent string
 * in the format hh:mm:ss.
 * @example 
 * var timeString = toReadableTimeString(2000);
 * console.log(timeString); //prints 00:00:02
 */
function toReadableTimeString(milliseconds) {
    if ((isNaN(milliseconds)) || (milliseconds < 0))
        throw new Error('The argument is not valid.');

    var seconds = Math.floor(milliseconds / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    
    hours %= 24;
    minutes %= 60;
    seconds %= 60;
    
    if (hours < 10)
        hours = `0${hours}`;
    if (minutes < 10)
        minutes = `0${minutes}`;
    if (seconds < 10)
        seconds = `0${seconds}`;
    
    return (`${hours}:${minutes}:${seconds}`);
}

/**
 * Checks the existence of an item in an array
 * 
 * @function itemExists
 * @param {String} item The item to search for in the array
 * @param {Array} array The array to search for the item
 * @return {Boolean} Returns true if the item exists in the array, otherwise false
 * @description The itemExists function iterates through an array and checks if the
 * item passed to the function argument exists in the array. The first parameter of the function
 * is the item to search for while the array to search for the item is the second parameter.
 * Note: The item to search for is converted to lower case during the search as well as the all the items
 * in the array.
 * @example
 * var fruits = ['Orange', 'Peach', 'Quince'];
 * var exists = itemExists('peach', fruits);
 * console.log(exists); //prints true
 */
function itemExists(item, array) {
    if (!(Array.isArray(array)))
        throw new Error('An invalid array is passed.');
    if ((array.some(element => element.title.toLowerCase() === item.toLowerCase())))
        return true;
    return false;
}
