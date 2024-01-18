const fs = require('fs');

function createAccount(req, res) {
    const { username, usermail, password, date } = req.body;

    fs.readFile('./users/users.json', (err, content) => {
        if (err)
            throw new Error('Could not read the users.json file.');
        const fileContent = JSON.parse(content);
        const userExists = fileContent.some((user => (user.username === username) || (user.usermail === usermail)));
        
        if (userExists)
            res.send({ userExists: true });
        else {
            fileContent[fileContent.length] = { username, usermail, password, date };

            fs.writeFile('./users/users.json', JSON.stringify(fileContent, null, '\t'), (err) => {
                if (err)
                    throw new Error('The new information could not be added to the users.json file.');
                
                fs.mkdir(`./users/${username}`, (err) => {
                    if (err)
                        throw new Error('The new directory could not be created.');
                    fs.writeFile(`./users/${username}/timers.json`, '[]', (err) => {
                        if (err)
                            throw new Error('Could not write the new timers.json file for the user.');
                        res.send({ userExists: false, registered: true });
                    });
                });
            });
        }
    });
}

module.exports = { createAccount };