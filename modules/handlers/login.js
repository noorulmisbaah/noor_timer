const fs = require('fs');

function login(req, res) {
    const { username, password } = req.body;

    fs.readFile('./users/users.json', (err, content) => {
        if (err)
            throw new Error('Could not read the users.json file.');
        const fileContent = JSON.parse(content);
        const [user] = fileContent.filter(user => (user.username === username));

        if (!user) {
            res.send(JSON.stringify({ exists: false }));
        } else if (user.password !== password) {
            res.send(JSON.stringify({ wrongPassword: true, exists: true }));
        } else {
            res.send(JSON.stringify({ exists: true, wrongPassword: false }));
        }
    });
}

module.exports = { login };