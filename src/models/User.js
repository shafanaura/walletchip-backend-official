// ===== User
// import all modules
const Database = require('./Database')

class User extends Database {
  constructor (table) {
    super()
    this.table = table
  }

  createUserAsync (data) {
    return new Promise((resolve, reject) => {
      this.db.query(
        `
      INSERT INTO ${this.table}
      (${Object.keys(data).join(', ')})
      VALUES
      (${Object.values(data)
        .map((item) => `"${item}"`)
        .join(', ')})
      `,
        (err, res, field) => {
          if (err) reject(err)
          resolve(res)
        }
      )
    })
  }

  getUserLastTransactions (data) {
    const sql = `SELECT users1.username AS user,
    users2.username AS another_user,
    users2.first_name,
    users2.last_name,
    users2.phone,
    transactions.transactionDate,
    users2.picture
    FROM transactions INNER JOIN
    users users1 ON users1.id = transactions.user_id
    INNER JOIN users users2 ON users2.id = transactions.receiver_id
    WHERE transactions.user_id = ${data.id}
    ORDER BY transactionDate DESC
    LIMIT ${data.offset}, ${data.limit}`
    return new Promise((resolve, reject) => {
      const query = this.db.query(sql, (err, results) => {
        if (err) {
          return reject(err)
        } else {
          resolve(results)
        }
      })
      console.log(query.sql)
    })
  }

  getUserLastTransactionsCount (id) {
    const sql = `
    SELECT COUNT (transactions.user_id)
    FROM transactions INNER JOIN
    users users1 ON users1.id = transactions.user_id
    INNER JOIN users users2 ON users2.id = transactions.receiver_id
    WHERE transactions.user_id = ${id}
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

  getUsersByConditionAsync (cond) {
    const sql = cond
      ? `SELECT * FROM ${this.table} 
      WHERE ${Object.keys(cond)
        .map((item) => `${item}="${cond[item]}"`)
        .join(' AND ')}`
      : `SELECT * FROM ${this.table}`
    return new Promise((resolve, reject) => {
      this.db.query(sql, (err, results) => {
        if (err) {
          return reject(err)
        } else {
          resolve(results)
        }
      })
    })
  }

  create (id, pin) {
    const sql = `UPDATE ${this.table} SET ? WHERE id = ?`

    return new Promise((resolve, reject) => {
      this.db.query(sql, [{ pin }, id], (err, results) => {
        if (err) {
          return reject(err)
        } else if (results.affectedRows < 1) {
          resolve(false)
        } else {
          resolve(true)
        }
      })
    })
  }

  findByCondition (cond) {
    const sql = cond
      ? `SELECT * FROM ${this.table} 
    WHERE ${Object.keys(cond)
      .map((item, index) => `${item} = '${Object.values(cond)[index]}'`)
      .join(' AND ')}`
      : `SELECT * FROM ${this.table}`

    return new Promise((resolve, reject) => {
      this.db.query(sql, (err, results) => {
        if (err) {
          return reject(err)
        } else {
          resolve(results)
        }
      })
    })
  }

  updateByCondition (data, cond) {
    const sql = `UPDATE ${this.table}
    SET ? 
    WHERE ${Object.keys(cond)
      .map((item, index) => `${item} = '${Object.values(cond)[index]}'`)
      .join(' AND ')}`

    return new Promise((resolve, reject) => {
      this.db.query(sql, data, (err, results) => {
        if (err) {
          return reject(err)
        } else if (results.affectedRows < 1) {
          resolve(false)
        } else {
          resolve(true)
        }
      })
    })
  }

  getUsersByIdAsync (id) {
    return new Promise((resolve, reject) => {
      this.db.query(
        `
      SELECT id, first_name, last_name, username, balance, picture, phone, email FROM ${this.table} WHERE id=${id}
    `,
        (err, res, field) => {
          if (err) reject(err)
          resolve(res)
        }
      )
    })
  }

  getReceiverDetails (id) {
    return new Promise((resolve, reject) => {
      this.db.query(
        `
      SELECT first_name, last_name, username, balance, picture, phone, email FROM ${this.table} WHERE id=${id}
    `,
        (err, res, field) => {
          if (err) reject(err)
          resolve(res)
        }
      )
    })
  }

  getPhotoByIdAsync (id) {
    return new Promise((resolve, reject) => {
      this.db.query(`
      SELECT picture FROM ${this.table} WHERE id=${id}
    `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  }

  getUserCount (id) {
    const sql = `SELECT COUNT('email') 
                 FROM ${this.table} 
                 WHERE verified = 1
                 AND id != ${id}`

    return new Promise((resolve, reject) => {
      this.db.query(sql, (err, results) => {
        if (err) {
          return reject(err)
        } else {
          return resolve(results[0]["COUNT('email')"])
        }
      })
    })
  }

  getUserCountSearch (data) {
    const sql = `SELECT COUNT('email') FROM ${this.table}
                 WHERE (verified = 1) AND
                 (id != ${data.id}) AND
                 (username LIKE '%${data.keyword}%' OR
                 email LIKE '%${data.keyword}%' OR
                 phone LIKE '%${data.keyword}%' )
                 ORDER BY ${data.by} ${data.sort}
                `
    return new Promise((resolve, reject) => {
      this.db.query(sql, (err, results) => {
        if (err) {
          return reject(err)
        } else {
          return resolve(results[0]["COUNT('email')"])
        }
      })
    })
  }

  updateUserDetails (id, data) {
    const key = Object.keys(data)
    const value = Object.values(data)
    return new Promise((resolve, reject) => {
      this.db.query(
        `
      UPDATE ${this.table}
      SET ${key.map((item, index) => `${item}="${value[index]}"`)}
      WHERE id=${id}
    `,
        (err, res, field) => {
          if (err) reject(err)
          resolve(res)
        }
      )
    })
  }

  findAll (data) {
    const sql = `SELECT id, email, first_name, 
                 last_name, username, phone, 
                 picture FROM ${this.table}
                 WHERE (verified = 1) AND
                 (id != ${data.id}) AND
                 (username LIKE '%${data.keyword}%' OR
                 email LIKE '%${data.keyword}%' OR
                 phone LIKE '%${data.keyword}%') 
                 ORDER BY ${data.by} ${data.sort}
                 LIMIT ${data.offset}, ${data.limit}
                `

    return new Promise((resolve, reject) => {
      this.db.query(sql, (err, results) => {
        if (err) {
          return reject(err)
        } else {
          return resolve(results)
        }
      })
    })
  }
}

module.exports = new User('users')
