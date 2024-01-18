/**
 * Copyright Noorul Misbah 2024-present. All rights reserved.
 */

const fs = require('fs');

function updateInformation(req, res) {
    const { user, items } = req.body;

    fs.writeFile(`./users/${user}/timers.json`, JSON.stringify(items, null, '\t'), (err) => {
        if (err)
            throw new Error('Could not update the timers.json file.');
        res.send(JSON.stringify({ updated: true }));
    });
}

module.exports = { updateInformation };