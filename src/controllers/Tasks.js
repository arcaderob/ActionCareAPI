const mysql = require('mysql');
const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    database : 'actioncare'
});

const createTask = ({taskData}) => {
    return new Promise((resolve) => connection.query(
        `INSERT INTO tasks (email, datetime, daily, task ) VALUES ('${taskData.email}', '${taskData.date}', ${taskData.daily ? 1 : 0}, '${taskData.task}');`,
        (error, results) => {
            if (error) throw error;

            resolve(results[0]);
        }
    ));
};

const deleteTask = (data) => {
    return new Promise((resolve) => connection.query(
        `SELECT * from tasks WHERE email='${data.email}' AND datetime='${data.item.split('at')[1].trim()}';`,
            (error, results) => {
                if (error) throw error;

                // if it is a daily task, we don't want to delete it
                if (results[0].daily[0]) {
                    connection.query(`UPDATE tasks SET completed='${data.deleteTime}' WHERE email='${data.email}' AND datetime='${data.item.split('at')[1].trim()}';`,
                        (innerError, innerResults) => {
                            if (innerError) throw innerError;

                            resolve(innerResults[0]);
                        }
                    );
                } else {
                    connection.query(`DELETE FROM tasks WHERE email='${data.email}' AND datetime='${data.item.split('at')[1].trim()}';`,
                        (innerError, innerResults) => {
                            if (innerError) throw innerError;

                            resolve(innerResults[0]);
                        }
                    );
                }
            }
    ));
};

// need to check if completed is before the current time
const _isNotCompletedForToday = (item) => item.completed === null || dayjs(item.completed).fromNow(dayjs()).indexOf('day') !== -1;

const _filterOutCompletedTasks = (tasks) => tasks.filter((item) => {
    if (!item.daily[0]) return item;
    if (item.daily[0] && _isNotCompletedForToday(item)) return item;
});

const fetchTasks = (email) => {
    return new Promise((resolve) => connection.query(
        `SELECT * from tasks where email='${email}'`,
        (error, results) => {
            if (error) throw error;

            resolve(_filterOutCompletedTasks(results));
        }
    ));
};

module.exports = {
    createTask,
    deleteTask,
    fetchTasks
};