const cron = require('node-cron');
const mysql = require('mysql');
const dayjs = require('dayjs');

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    database : 'actioncare'
});

const startCronJob = () => {
    cron.schedule('*/1 * * * *', () => {
        const now = dayjs().format('YYYY-MM-DDTHH:mm:ss.000[Z]');
        connection.query(`SELECT * FROM tasks WHERE daily=true AND DATE(completed) < (DATE('${now}') - INTERVAL 1 DAY) OR (daily=true AND completed IS NULL) OR (daily=false AND (DATE(datetime) < DATE('${now}')));`, (error, results) => {
            if (error) throw error;

            console.log(results);
        });
    });
};

module.exports = {
    startCronJob
};