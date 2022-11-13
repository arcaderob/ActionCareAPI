const mysql = require('mysql');
const crypto = require('crypto');
const e = require('express');

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    database : 'actioncare'
});

const createSessionObject = () => {
    const date = new Date(); // Now
    const expiry = date.setDate(date.getDate() + 30); // Now plus 30 days
    const hash = crypto.randomBytes(20).toString('hex');

    return {
        expiry,
        hash,
    }
};

const getAccount = (username, password) => {
    // Execute SQL query that'll select the account from the database based on the specified username and password
    return new Promise((resolve) => {
        connection.query('SELECT * FROM accounts WHERE firstname = ? AND password = ?', [username, password], (error, results) => {
            // If there is an issue with the query, output the error
            if (error) throw error;
            // If the account exists
            if (results.length < 1) throw 'Incorrect Username and/or Password!';
    
            return resolve(results[0]);
        });
    }); 
};

const updateData = (sessionData, result) => {
    return new Promise((resolve) => {
        connection.query('UPDATE accounts SET session = ?, expiry = ? WHERE id = ?', [sessionData.hash, sessionData.expiry, result.id], (innerError, innerResults) => {
            // If there is an issue with the query, output the error
            if (innerError || innerResults.length < 1) throw innerError;
    
            return resolve(true);
        });
    });
};

exports.login = ({username, password}) => {
    const sessionData = createSessionObject();

     return new Promise((resolve) => {
        getAccount(username, password)
        .then((result) => updateData(sessionData, result))
        .then(() => {
            return resolve(sessionData);
        })
        .catch((e) => {
            throw e;
        });
    });
};