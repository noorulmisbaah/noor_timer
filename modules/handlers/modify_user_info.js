const fs = require('fs');

function writeToFile(fileContent) {
    fs.writeFile('./users/users.json', JSON.stringify(fileContent, null, '\t'), (err) => {
        if (err)
            throw new Error('Updating the users.json file was unsuccessful.');
    });
}

function renameDirectory(currentUsername, newUsername) {
    if (!fs.existsSync(`./users/${currentUsername}`))
        return;
    else {
        fs.rename(`./users/${currentUsername}`, `./users/${newUsername}`, (err) => {
            if (err)
                throw new Error('Could not rename the directory.');
        });
    }
}

function updateInformation(req, res) {
    const { currentUsername, currentUsermail, newUsername, newUsermail, currentPassword, newPassword } = req.body;
    
    fs.readFile('./users/users.json', (err, content) => {
        if (err)
           throw new Error('Could not read the users.json file.');
        const fileContent = JSON.parse(content);
        const userExists = fileContent.some(user => (user.username === newUsername) || (user.usermail === newUsermail));

        if (userExists)
            res.send(JSON.stringify({ updated: false, userExists }));
        else {
            const [currentUser] = fileContent.filter(user => user.username === currentUsername);

            if (!currentUser)
                return;
            else if (currentPassword) {
                if (currentUser.password !== currentPassword)
                   res.send(JSON.stringify({ passwordMismatch: true }));
                else {
                    for (var i = 0; i < fileContent.length; i++) {
                        if (fileContent[i].username === currentUsername) {
                           fileContent[i].password = newPassword;
                           fileContent[i].username = newUsername || currentUsername;
                           fileContent[i].usermail = newUsermail || currentUsermail;
                           break;
                        }
                    }

                    writeToFile(fileContent);
                    renameDirectory(currentUsername, newUsername);
                    res.send(JSON.stringify({ updated: true }));
               }
            } else {
                for (var i = 0; i < fileContent.length; i++) {
                    if (fileContent[i].username === currentUsername) {
                        fileContent[i].username = newUsername || currentUsername;
                        fileContent[i].usermail = newUsermail || currentUsermail;
                        break;
                    }      
                }
            
                writeToFile(fileContent);
                newUsername && renameDirectory(currentUsername, newUsername);
                res.send(JSON.stringify({ updated: true }));
            }
        }
    });
}

module.exports = { updateInformation };