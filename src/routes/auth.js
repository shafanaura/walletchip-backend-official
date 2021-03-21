// ======== Server
// import all modules
const express = require('express')

// import all controllers
const authController = require('../controllers/authController')

// import all middlewares
const authMiddleware = require('../middlewares/auth')

// init router
const router = express.Router()

router.post(
  '/auth/pin',
  authMiddleware.authCheck,
  authMiddleware.isPinEmpty,
  authMiddleware.isPinNumber,
  authMiddleware.isLength,
  authController.createPin
)

router.patch(
  '/auth/pin',
  authMiddleware.authCheck,
  authMiddleware.isPinEmpty,
  authMiddleware.isPinNumber,
  authMiddleware.isLength,
  authController.changePin
)

router.post(
  '/auth/currentPin',
  authMiddleware.authCheck,
  authMiddleware.checkIdCurrentPin,
  authMiddleware.isPinEmpty,
  authMiddleware.isPinNumber,
  authMiddleware.isLength,
  authController.comparePin
)

router.post(
  '/auth/register',
  authMiddleware.isFieldsEmpty,
  authMiddleware.isFieldsLength,
  authController.register
)

router.post(
  '/auth/login',
  authController.login)

router.patch(
  '/auth/verified',
  authMiddleware.authCheck,
  authController.activateAccount
)

router.post(
  '/auth/password',
  authMiddleware.checkEmail,
  authController.getResetPasswordLink
)

router.patch(
  '/auth/password/:id',
  authMiddleware.checkPassword,
  authController.resetPassword
)

module.exports = router
