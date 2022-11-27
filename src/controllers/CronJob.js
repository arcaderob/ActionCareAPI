const cron = require('node-cron');
const mysql = require('mysql');
const dayjs = require('dayjs');
const axios = require('axios');

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    database : 'actioncare'
});

const _formatDate = (date = new Date()) => dayjs(date).format('YYYY-MM-DDTHH:mm:ss.000[Z]');
const _getTaskTime = (date) => dayjs(date).format('HH:mm');

const _sendPushNotifications = (emails, task, time) => {
    return new Promise((resolve) => {
        axios.post(`https://app.nativenotify.com/api/indie/group/notification`, {
            subIDs: emails,
            appId: 5033,
            appToken: 'iCsXYfWlLbPcCl9Dr0P1H9',
            title: 'Missed Task',
            message: `Missed ${task} at ${time}`,
            })
            .then((resp) => {
                console.log('Notification Sent', resp);
                connection.query(`UPDATE tasks SET notification_sent=true WHERE task='${task}'`,
                    (error, _) => {
                        if (error) throw error;

                        console.log('Notification sent updated');
                    }
                );
            })
            .catch((e) => {
                console.log('There is an axios error');
            })
            .finally(() => resolve());
    });
};

const startCronJob = () => {
    cron.schedule('*/1 * * * *', () => {
        const now = _formatDate();
        connection.query(`SELECT * FROM tasks WHERE notification_sent=false AND daily=true AND DATE(completed) < (DATE('${now}') - INTERVAL 1 DAY) OR (notification_sent=false AND daily=true AND completed IS NULL) OR (notification_sent=false AND daily=false AND (DATE(datetime) < DATE('${now}')));`,
        (error, results) => {
            if (error) throw error;

            results.forEach((row) => {
                if (!row.notification_sent[0]) {
                    connection.query(`SELECT * FROM subscriptions WHERE patientEmail='${row.email}'`,
                        async (innerError, innerResults) => {
                            if (innerError) throw innerError;

                            if (innerResults.length) {
                                const emails = [row.email];
                                innerResults.forEach((item) => {
                                    emails.push(item.subscriberEmail);
                                });

                                await _sendPushNotifications(emails, row.task, _getTaskTime(row.datetime));
                            }
                        }
                    );
                }
            });
        });
    });
};

module.exports = {
    startCronJob
};