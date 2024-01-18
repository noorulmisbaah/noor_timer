const fs = require('fs');

function deleteAccount(req, res) {
    const { username } =  req.body;
    
    fs.readFile('./users/users.json', (err, content) => {
        if (err)
            throw new Error('Could not read the users.json file.');
        const fileContent = JSON.parse(content);
        const userExists = fileContent.some(user => user.username === username);

        if (!userExists)
            return;
        const updatedList = fileContent.filter(user => user.username !== username);

        fs.writeFile('./users/users.json', JSON.stringify(updatedList, null, '\t'), (err) => {
            if (err)
                throw new Error('Unable to update the users.json file.');
            removeDirectory(username, res);
        });
    });
}

function removeDirectory(username, res) {
    if (!fs.existsSync(`./users/${username}`))
        return;
    fs.unlink(`./users/${username}/timers.json`, (err) => {
        if (err)
            throw new Error('The timers.json file could not be removed.');
        fs.rmdir(`./users/${username}`, (err) => {
            if (err)
                throw new Error('The directory could not be removed.');
            res.send(JSON.stringify({ deleted: true }));
        });
    });
}

module.exports = { deleteAccount };