const fs = require('fs');

function addComment(req, res) {
    const { date, author, comment } = req.body;

    fs.readFile('./users/comments.json', (err, content) => {
        if (err)
            throw new Error('Could not read the comments.json file.');
        const fileContent = JSON.parse(content);
        const commentExists = fileContent.some(post => post.comment === comment);
        const userExists = JSON.parse(fs.readFileSync('./users/users.json')).some(user => user.username === author);

        if (commentExists || !userExists)
            return;
        fileContent[fileContent.length] = { date, author, comment };
        
        fs.writeFile('./users/comments.json', JSON.stringify(fileContent, null, '\t'), (err) => {
            if (err)
                throw new Error('The comment could not be added.');
            res.send(JSON.stringify({ exists: false, added: true }));
        }); 
    });
}

module.exports = { addComment };