const mysql = require('mysql');

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    database : 'actioncare'
});

const createSubscriber = ({data}) => {
    return new Promise((resolve) => {
        connection.query(`SELECT * FROM subscriptions WHERE patientEmail='${data.patient}' AND subscriberEmail='${data.subscriber}'`,
        (error, results) => {
            if (error) throw error;
            if (results.length) return;

            connection.query(`INSERT INTO subscriptions (patientEmail, subscriberEmail) VALUES ('${data.patient}', '${data.subscriber}')`,
            (innerError, innerResults) => {
                if (innerError) throw innerError;

                resolve(innerResults[0]);
            });
        });
    });
};

const fetchSubscribers = (email) => {
    return new Promise((resolve) => {
        connection.query(`SELECT * FROM subscriptions WHERE patientEmail='${email}'`,
        (error, results) => {
            if (error) throw error;

            resolve(results);
        });
    })
};

module.exports = {
    createSubscriber,
    fetchSubscribers
};