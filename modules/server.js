/**
* Copyright Noorul Misbah 2024. All rights reserved. 
*/

//Modules imports
const log = require('./handlers/login');
const loggedIn = require('./handlers/logged_in');
const signup = require('./handlers/create_account');
const update = require('./handlers/update_timer');
const modify = require('./handlers/modify_user_info');
const recovery = require('./handlers/recover_account');
const comment = require('./handlers/comment');
const remove = require('./handlers/delete_account');
const express = require('express');
const app = express();

//Server stetup
function start() {
    
    app.listen(process.env.PORT || 8000);
    app.set('view engine', 'ejs');
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(express.static('rsc'));
    
    app.get('/', (req, res) => {
        res.render('index');
    });

    app.post('/login', (req, res) => {
        log.login(req, res);
    });

    app.post('/interface', (req, res) => {
        loggedIn.showInterface(req, res);
    });

    app.post('/update_data', (req, res) => {
        update.updateInformation(req, res);
    });

    app.post('/create_account', (req, res) => {
        signup.createAccount(req, res);
    });

    app.post('/recover_account', (req, res) => {
        recovery.sendMail(req, res);
    });

    app.post('/add_comment', (req, res) => {
        comment.addComment(req, res);
    });

    app.put('/update_information', (req, res) => {
        modify.updateInformation(req, res);
    });

    app.delete('/delete_account', (req, res) => {
        remove.deleteAccount(req, res);
    });

    app.use((req, res) => {
        res.sendFile('404.html', { root: './views' });
    });
}

module.exports = { start };