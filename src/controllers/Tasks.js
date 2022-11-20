const mysql = require('mysql');

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
        })
    );
};

const fetchTasks = (email) => {
    return new Promise((resolve) => connection.query(
        `SELECT * from tasks where email='${email}'`,
        (error, results) => {
            if (error) throw error;

            resolve(results);
        }
    ));
};

module.exports = {
    createTask,
    fetchTasks
};