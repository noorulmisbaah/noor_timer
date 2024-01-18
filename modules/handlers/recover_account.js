const fs = require('fs');
const mailer = require('nodemailer');
const mailTemplate = require('../handlers/mail_template');
const Styliner = require('styliner');
const style = new Styliner('./mail_template');

function sendMail(req, res) {
    const { usermail } = req.body;

    fs.readFile('./users/users.json', (err, content) => {
        if (err)
            throw new Error('Could not read the users.json file.');
        const fileContent = JSON.parse(content);
        const [user] = fileContent.filter(user => user.usermail === usermail);

        if (!user)
            res.send(JSON.stringify({ found: false }));
        else {
            mailTemplate.createMailTemplate(user.username, user.password);
            const sender = mailer.createTransport({
                service: 'gmail',
                secure: true,
                auth: {
                    user: 'noorulmisbaah.noor@gmail.com',
                    pass: 'nndl isjz hlio oznh'
                }
            });

            const mailOptions = {
                from: 'noorulmisbaah.noor@gmail.com',
                to: 'aminunawwarah@gmail.com',
                subject: 'Account Recovery',
            }
            fs.readFile('./mail_template/index.html', (err, content) => {
                if (err)
                    throw new Error('Could not read the index.html file template.');
                mailOptions.html = content.toString()
                sender.sendMail(mailOptions, (err, info) => {
                    if (err) 
                        res.send(JSON.stringify({ sent: false, found: true }));
                    else 
                        res.send(JSON.stringify({ sent: true, found: true }));
                });
            });
        }
    });
}

module.exports = { sendMail };