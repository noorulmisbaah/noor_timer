const fs = require('fs');

function showInterface(req, res) {
    const { username } = req.body;
    const [user] = JSON.parse(fs.readFileSync('./users/users.json')).filter(user => user.username === username);

    if (!fs.existsSync(`./users/${username}`))
        res.render('index');
    else {
        fs.readFile(`./users/${username}/timers.json`, (err, timers) => {
            if (err)
                throw new Error('Could not read the timers.json file from the directory of the user.');
            fs.readFile('./users/comments.json', (err, comments) => {
                if (err)
                    throw new Error('Could not read the comments.json file.');
                    res.render('interface', { timers, comments, ...user });
            });
        });
    }
}

module.exports = { showInterface };