// ======== Transaction
// import all modules
const express = require('express')

// import all controllers
const transactionController = require('../controllers/transactionController')

// import all middlewares
const authMiddleware = require('../middlewares/auth')
const transactionMiddleware = require('../middlewares/transaction')

// init router
const router = express.Router()

router.get(
  '/transaction-history',
  authMiddleware.authCheck,
  transactionController.getUserTransactionHistory
)

router.get(
  '/transaction-history-today',
  authMiddleware.authCheck,
  transactionController.getUserTransactionHistoryToday
)

router.get(
  '/transaction-history-week',
  authMiddleware.authCheck,
  transactionController.getUserTransactionHistoryWeek
)

router.get(
  '/transaction-history-month',
  authMiddleware.authCheck,
  transactionController.getUserTransactionHistoryMonth
)

router.post(
  '/transfer',
  authMiddleware.authCheck,
  transactionMiddleware.checkTransactionForm,
  transactionController.createTransfer
)

router.get(
  '/transaction-quick-access',
  authMiddleware.authCheck,
  transactionController.getUserQuickAccess
)

module.exports = router
