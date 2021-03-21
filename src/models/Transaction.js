// ===== User
// import all modules
const { query } = require("express-validator");
const Database = require("./Database");

class Transaction extends Database {
  constructor(table) {
    super();
    this.table = table;
  }

  getUserTransactionHistory(data) {
    return new Promise((resolve, reject) => {
      const query = this.db.query(
        `
      SELECT users1.username AS user,
      users2.username AS another_user,
      transactions.is_transfer AS did_user_transfer,
      transactions.amount,
      transactions.transactionDate,
      users2.picture
      FROM transactions INNER JOIN
      users users1 ON users1.id = transactions.user_id
      INNER JOIN users users2 ON users2.id = transactions.receiver_id
      WHERE transactions.user_id = ${data.id} ${
          data.from && data.to
            ? `AND transactions.transactionDate BETWEEN '${data.from}' AND '${data.to}'`
            : ""
        }
      ORDER BY transactionDate DESC
      LIMIT ${data.offset}, ${data.limit}
    `,
        (err, res, field) => {
          if (err) reject(err);
          resolve(res);
        }
      );
      console.log(query.sql);
    });
  }

  getTransactionLastWeek(id, dateNow, lastWeekDate) {
    return new Promise((resolve, reject) => {
      const query = this.db.query(
        `
      SELECT * FROM ${this.table}
      WHERE (user_id=${id} OR receiver_id=${id})
      AND transactionDate >= '${lastWeekDate}' AND '${dateNow}' >= transactionDate
      ORDER BY transactionDate ASC
      `,
        (err, res, field) => {
          if (err) reject(err);
          resolve(res);
        }
      );
      console.log(query.sql);
    });
  }

  getTransactionHistoryCount(id) {
    const sql = `
    SELECT COUNT (transactions.user_id)
    FROM transactions INNER JOIN
    users users1 ON users1.id = transactions.user_id
    INNER JOIN users users2 ON users2.id = transactions.receiver_id
    WHERE transactions.user_id = ${id}
    ORDER BY transactionDate DESC
    `;
    return new Promise((resolve, reject) => {
      this.db.query(sql, (err, results) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(Object.values(results[0])[0]);
        }
      });
    });
  }

  getUserTransactionTodayHistory (data) {
    return new Promise((resolve, reject) => {
      const today = new Date()
      const todayString = today.toISOString().split('T')[0]
      this.db.query(`
      SELECT users1.username AS user,
      users2.username AS another_user,
      transactions.is_transfer AS did_user_transfer,
      transactions.amount,
      transactions.transactionDate,
      users2.picture
      FROM transactions INNER JOIN
      users users1 ON users1.id = transactions.user_id
      INNER JOIN users users2 ON users2.id = transactions.receiver_id
      WHERE transactions.user_id = ${data.id} AND transactionDate LIKE '%${todayString}%'
      ORDER BY transactionDate DESC
      LIMIT ${data.offset}, ${data.limit}
    `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  }

  getTodayTransactionHistoryCount (id) {
    const today = new Date()
    const todayString = today.toISOString().split('T')[0]
    const sql = `
    SELECT COUNT (transactions.user_id)
    FROM transactions INNER JOIN
    users users1 ON users1.id = transactions.user_id
    INNER JOIN users users2 ON users2.id = transactions.receiver_id
    WHERE transactions.user_id = ${id} AND transactionDate LIKE '%${todayString}%'
    ORDER BY transactionDate DESC
    `
    return new Promise((resolve, reject) => {
      this.db.query(sql, (err, results) => {
        if (err) {
          return reject(err)
        } else {
          return resolve(Object.values(results[0])[0])
        }
      })
    })
  }

  getUserTransactionWeekHistory (data) {
    return new Promise((resolve, reject) => {
      const yesterday = new Date()
      const week = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = `${yesterday.toISOString().split('T')[0]}T23:59:59`
      week.setDate(week.getDate() - 7)
      const weekString = `${week.toISOString().split('T')[0]}T23:59:59`
      console.log(yesterdayString)
      console.log(weekString)
      this.db.query(`
      SELECT users1.username AS user,
      users2.username AS another_user,
      transactions.is_transfer AS did_user_transfer,
      transactions.amount,
      transactions.transactionDate,
      users2.picture
      FROM transactions INNER JOIN
      users users1 ON users1.id = transactions.user_id
      INNER JOIN users users2 ON users2.id = transactions.receiver_id
      WHERE transactions.user_id = ${data.id} AND transactionDate <= '${yesterdayString}'
      AND transactionDate >= '${weekString}'
      ORDER BY transactionDate DESC
      LIMIT ${data.offset}, ${data.limit}
    `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  }

  getWeekTransactionHistoryCount (id) {
    const yesterday = new Date()
    const week = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayString = `${yesterday.toISOString().split('T')[0]}T23:59:59`
    week.setDate(week.getDate() - 7)
    const weekString = `${week.toISOString().split('T')[0]}T23:59:59`
    console.log(yesterdayString)
    console.log(weekString)
    const sql = `
    SELECT COUNT (transactions.user_id)
    FROM transactions INNER JOIN
    users users1 ON users1.id = transactions.user_id
    INNER JOIN users users2 ON users2.id = transactions.receiver_id
    WHERE transactions.user_id = ${id} AND transactionDate <= '${yesterdayString}'
      AND transactionDate >= '${weekString}'
    ORDER BY transactionDate DESC
    `
    return new Promise((resolve, reject) => {
      this.db.query(sql, (err, results) => {
        if (err) {
          return reject(err)
        } else {
          return resolve(Object.values(results[0])[0])
        }
      })
    })
  }

  getUserTransactionMonthHistory (data) {
    return new Promise((resolve, reject) => {
      const month = new Date()
      const week = new Date()
      month.setMonth(month.getMonth() - 1)
      const monthString = `${month.toISOString().split('T')[0]}T23:59:59`
      week.setDate(week.getDate() - 7)
      const weekString = `${week.toISOString().split('T')[0]}T23:59:59`
      console.log(monthString)
      console.log(weekString)
      this.db.query(`
      SELECT users1.username AS user,
      users2.username AS another_user,
      transactions.is_transfer AS did_user_transfer,
      transactions.amount,
      transactions.transactionDate,
      users2.picture
      FROM transactions INNER JOIN
      users users1 ON users1.id = transactions.user_id
      INNER JOIN users users2 ON users2.id = transactions.receiver_id
      WHERE transactions.user_id = ${data.id} AND transactionDate < '${weekString}'
      AND transactionDate >= '${monthString}'
      ORDER BY transactionDate DESC
      LIMIT ${data.offset}, ${data.limit}
    `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  }

  getMonthTransactionHistoryCount (id) {
    const month = new Date()
    const week = new Date()
    month.setMonth(month.getMonth() - 1)
    const monthString = `${month.toISOString().split('T')[0]}T23:59:59`
    week.setDate(week.getDate() - 7)
    const weekString = `${week.toISOString().split('T')[0]}T23:59:59`
    console.log(monthString)
    console.log(weekString)
    const sql = `
    SELECT COUNT (transactions.user_id)
    FROM transactions INNER JOIN
    users users1 ON users1.id = transactions.user_id
    INNER JOIN users users2 ON users2.id = transactions.receiver_id
    WHERE transactions.user_id = ${id} AND transactionDate < '${weekString}'
    AND transactionDate >= '${monthString}'
    ORDER BY transactionDate DESC
    `
    return new Promise((resolve, reject) => {
      this.db.query(sql, (err, results) => {
        if (err) {
          return reject(err)
        } else {
          return resolve(Object.values(results[0])[0])
        }
      })
    })
  }

  create(data) {
    const sql = `INSERT INTO ${this.table} 
                (${Object.keys(data[0])
                  .map((item) => `${item}`)
                  .join()})
                 VALUES ${data.map(
                   (item) =>
                     `(${Object.values(item)
                       .map((item) => `'${item}'`)
                       .join()})`
                 )}`;
    return new Promise((resolve, reject) => {
      this.db.query(sql, (err, results) => {
        if (err) {
          return reject(err);
        } else if (results.affectedRows < 1) {
          resolve(false);
        } else {
          resolve(results.insertId);
        }
      });
    });
  }

  updateByCondition(data, cond) {
    const sql = `UPDATE ${this.table}
    SET ? 
    WHERE ${Object.keys(cond)
      .map((item, index) => `${item} = '${Object.values(cond)[index]}'`)
      .join(" AND ")}`;

    return new Promise((resolve, reject) => {
      this.db.query(sql, data, (err, results) => {
        if (err) {
          return reject(err);
        } else if (results.affectedRows < 1) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  findByCondition(cond) {
    const sql = cond
      ? `SELECT * FROM ${this.table} 
    WHERE ${Object.keys(cond)
      .map((item, index) => `${item} = '${Object.values(cond)[index]}'`)
      .join(" AND ")}`
      : `SELECT * FROM ${this.table}`;

    return new Promise((resolve, reject) => {
      this.db.query(sql, (err, results) => {
        if (err) {
          return reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }
}

module.exports = new Transaction("transactions");
