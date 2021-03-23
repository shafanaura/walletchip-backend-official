// ==== import module
const response = require('../helpers/response')
const bcrypt = require('bcryptjs')

// ===== import models
const transactionsModel = require('../models/Transaction')
const usersModel = require('../models/User')

// === import helpers
const { sendNotif } = require('../helpers/firebase')

const { FILE_URL } = process.env

exports.getUserTransactionHistory = async (req, res) => {
  const userID = req.userData.id
  const { page = 1, limit = 4 } = req.query
  const { from, to } = req.body

  try {
    const startData = (limit * page) - limit
    const results = await transactionsModel.getUserTransactionHistory({ from, to, id: userID, offset: startData, limit })
    const totalData = await transactionsModel.getTransactionHistoryCount(userID)
    const totalPages = Math.ceil(totalData / limit)

    if (results.length < 1) {
      return response(res, 200, true, 'User has no transactional history')
    } else {
      const modified = results.map(data => ({
        user: data.user,
        another_user: data.another_user,
        did_user_transfer: data.did_user_transfer,
        amount: data.amount,
        transactionDate: data.transactionDate,
        picture: `${FILE_URL}/${data.picture}`
      }))
      return response(res, 200, true, 'User transactionals history list', modified, totalData, totalPages, page, req)
    }
  } catch (err) {
    response(res, 400, false, 'Failed to get user transactional history')
    console.log(err)
    throw new Error(err)
  }
}

exports.getUserTransactionHistoryToday = async (req, res) => {
  const userID = req.userData.id
  const {
    page = 1,
    limit = 4
  } = req.query

  try {
    const startData = (limit * page) - limit
    const results = await transactionsModel.getUserTransactionTodayHistory({ id: userID, offset: startData, limit })
    const totalData = await transactionsModel.getTodayTransactionHistoryCount(userID)
    const totalPages = Math.ceil(totalData / limit)

    if (results.length < 1) {
      return response(res, 200, true, 'User has no transactional history')
    } else {
      const modified = results.map((data) => ({
        user: data.user,
        another_user: data.another_user,
        did_user_transfer: data.did_user_transfer,
        amount: data.amount,
        transactionDate: data.transactionDate,
        picture: `${FILE_URL}/${data.picture}`
      }))
      return response(
        res,
        200,
        true,
        'User transactionals history list',
        modified,
        totalData,
        totalPages,
        page,
        req
      )
    }
  } catch (err) {
    response(res, 400, false, 'Failed to get user transactional history')
    console.log(err)
    throw new Error(err)
  }
}

exports.getUserTransactionHistoryWeek = async (req, res) => {
  const userID = req.userData.id
  const {
    page = 1,
    limit = 4
  } = req.query

  try {
    const startData = (limit * page) - limit
    const results = await transactionsModel.getUserTransactionWeekHistory({ id: userID, offset: startData, limit })
    const totalData = await transactionsModel.getWeekTransactionHistoryCount(userID)
    const totalPages = Math.ceil(totalData / limit)

    if (results.length < 1) {
      return response(res, 200, true, 'User has no transactional history')
    } else {
      const modified = results.map(data => ({
        user: data.user,
        another_user: data.another_user,
        did_user_transfer: data.did_user_transfer,
        amount: data.amount,
        transactionDate: data.transactionDate,
        picture: `${FILE_URL}/${data.picture}`
      }))
      return response(res, 200, true, 'User transactionals history list', modified, totalData, totalPages, page, req)
    }
  } catch (err) {
    response(res, 400, false, 'Failed to get user transactional history')
    console.log(err)
    throw new Error(err)
  }
}

exports.getUserTransactionHistoryMonth = async (req, res) => {
  const userID = req.userData.id
  const {
    page = 1,
    limit = 4
  } = req.query

  try {
    const startData = (limit * page) - limit
    const results = await transactionsModel.getUserTransactionMonthHistory({ id: userID, offset: startData, limit })
    const totalData = await transactionsModel.getMonthTransactionHistoryCount(userID)
    const totalPages = Math.ceil(totalData / limit)

    if (results.length < 1) {
      return response(res, 200, true, 'User has no transactional history')
    } else {
      const modified = results.map(data => ({
        user: data.user,
        another_user: data.another_user,
        did_user_transfer: data.did_user_transfer,
        amount: data.amount,
        transactionDate: data.transactionDate,
        picture: `${FILE_URL}/${data.picture}`
      }))
      return response(res, 200, true, 'User transactionals history list', modified, totalData, totalPages, page, req)
    }
  } catch (err) {
    response(res, 400, false, 'Failed to get user transactional history')
    console.log(err)
    throw new Error(err)
  }
}

exports.getUserQuickAccess = async (req, res) => {
  const userID = req.userData.id
  const {
    page = 1,
    limit = 4
  } = req.query

  try {
    const startData = (limit * page) - limit
    const results = await transactionsModel.getUserQuickAccess({ id: userID, offset: startData, limit })
    const totalData = await transactionsModel.getUserQuickAccessCount(userID)
    const totalPages = Math.ceil(totalData / limit)

    if (results.length < 1) {
      return response(res, 200, true, 'User has no quick access')
    } else {
      const modified = results.map(data => ({
        first_name: data.first_name,
        username: data.username,
        user_id: data.user_id,
        phone: data.phone,
        transactionDate: data.transactionDate,
        picture: `${FILE_URL}/${data.another_user_picture}`
      }))
      return response(res, 200, true, 'User quick access list', modified, totalData, totalPages, page, req)
    }
  } catch (err) {
    response(res, 400, false, 'Failed to get user quick access')
    console.log(err)
    throw new Error(err)
  }
}

exports.createTransfer = async (req, res) => {
  const { receiverId, transactionDate, note, amount, pin } = req.body

  const { id: userId } = req.userData

  try {
    const pinHashed = await usersModel.findByCondition({
      id: userId
    })

    if (!(await bcrypt.compare(pin, pinHashed[0].pin))) {
      return response(res, 400, false, 'Wrong pin')
    } else {
      try {
        const pastBalanceSender = await usersModel.findByCondition({
          id: userId
        })

        const pastBalanceReceiver = await usersModel.findByCondition({
          id: receiverId
        })

        if (!pastBalanceSender || !pastBalanceReceiver) {
          return response(
            res,
            400,
            false,
            'Failed to get past balance, unkown id'
          )
        } else {
          const balanceMin =
            Number(pastBalanceSender[0].balance) - Number(amount)
          const balanceMax =
            Number(pastBalanceReceiver[0].balance) + Number(amount)

          if (Number(pastBalanceSender[0].balance) < 1) {
            return response(res, 400, false, 'No balance')
          } else if (Number(pastBalanceSender[0].balance) < Number(amount)) {
            return response(res, 400, false, 'Insufficient balance')
          }

          try {
            const transferSender = await usersModel.updateByCondition(
              { balance: balanceMin },
              {
                id: userId
              }
            )
            const transferReceiver = await usersModel.updateByCondition(
              { balance: balanceMax },
              {
                id: receiverId
              }
            )

            if (!transferReceiver || !transferSender) {
              return response(res, 400, false, 'Failed to transfer')
            } else {
              try {
                const data = [
                  {
                    receiver_id: receiverId,
                    transactionDate,
                    note,
                    amount,
                    user_id: userId,
                    is_transfer: 1
                  },
                  {
                    receiver_id: userId,
                    transactionDate,
                    note,
                    amount,
                    user_id: receiverId,
                    is_transfer: 0
                  }
                ]
                const insertTransaction = await transactionsModel.create(data)

                if (!insertTransaction) {
                  return response(res, 400, false, 'Failed to transfer')
                } else {
                  try {
                    const receiverData = await usersModel.findByCondition({
                      id: receiverId
                    })
                    if (receiverData[0].token !== null) {
                      sendNotif(receiverData[0].token, 'Transfer', `Transfer from ${pinHashed[0].username} with a nominal Rp. ${data[0].amount}`, 'HomePage')
                    }
                    return response(res, 200, true, 'Transfer Success', {
                      id: insertTransaction,
                      ...req.body,
                      phone: receiverData[0].phone,
                      firstName: receiverData[0].first_name,
                      lastName: receiverData[0].last_name,
                      picture: `${process.env.APP_URL}/uploads/${receiverData[0].picture}`,
                      pin: undefined
                    })
                  } catch (err) {
                    console.log(err)
                    return response(
                      res,
                      500,
                      false,
                      'Failed to get sender data, server errror'
                    )
                  }
                }
              } catch (err) {
                console.log(err)
                return response(
                  res,
                  500,
                  false,
                  'Failed to transfer, server errror'
                )
              }
            }
          } catch (err) {
            console.log(err)
            return response(
              res,
              500,
              false,
              'Failed to transfer, server errror'
            )
          }
        }
      } catch (err) {
        console.log(err)
        return response(
          res,
          500,
          false,
          'Failed to get past balance, server errror'
        )
      }
    }
  } catch (err) {
    console.log(err)
    return response(res, 500, false, 'Failed to verify pin, server error')
  }
}
