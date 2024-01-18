const fs = require('fs');

function createMailTemplate(username, password) {
    const template = `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
        </head>
        <body style="font-family: Verdana">
            <p style="text-align: center; color: #FFBB00; font-size: 2rem;">Noor Timer</p>
            <p>Hello <span style="text-transform: capitalize">${username}</span>, use the following
            information to login to your account.</p>
            <div class="account-info"> 
                <p>Username: ${username}</p>
                <p>Password: ${password}</p>
            </div>
            <p>Do not share your login details with anyone.</p>
            <p>Thank you for using Noor Timer. If you discover any bug in our application or have a suggestion, please contact us
            via noorulmisbaah.noor@gmail.com or aminunawwarah@gmail.com.</p>
            <footer>
                <p style="text-align: center; color: #505050">&copy; Noorul Misbah 2024. All rights reserved.</p>
            </footer>
        </body>
    </html>`

    fs.writeFile('./mail_template/index.html', template, (err) => {
        if (err)
            throw new Error('Could not create the HTML template.');
    });
}

module.exports = { createMailTemplate };