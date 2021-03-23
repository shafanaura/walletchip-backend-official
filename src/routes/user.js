// ======== Server
// import all modules
const express = require("express");
const upload = require("../helpers/upload");

// import all controllers
const userController = require("../controllers/userController");

// import all middlewares
const userMiddleware = require("../middlewares/user");
const authMiddleware = require("../middlewares/auth");

// init router
const router = express.Router();

router.get(
  "/dashboard/profile",
  authMiddleware.authCheck,
  userController.getUserDetails
);

router.get("/user/:id", userController.getUserById);

router.patch(
  "/dashboard/update-profile",
  authMiddleware.authCheck,
  userController.updateUserDetails
);

router.get(
  "/user",
  authMiddleware.authCheck,
  userMiddleware.isGetUsersListValid,
  userController.getAllUsers
);

router.get(
  "/user/quick-access",
  authMiddleware.authCheck,
  userMiddleware.isGetUsersListValid,
  userController.getLatestTransactions
);

router.get(
  "/receiver/:id",
  authMiddleware.authCheck,
  userMiddleware.isGetUsersListValid,
  userController.getReceiverDetails
);

router.patch(
  "/user/password/:id",
  authMiddleware.authCheck,
  userMiddleware.checkResetPassword,
  userController.resetPassword
);

router.patch(
  "/user",
  authMiddleware.authCheck,
  userMiddleware.checkEditProfile,
  userController.editProfile
);

router.patch(
  "/user/picture",
  authMiddleware.authCheck,
  userMiddleware.checkUploadFile,
  upload,
  userController.upload
);

// router.patch(
//   '/phone/delete',
//   authMiddleware.authCheck,
//   userMiddleware.checkEditPhone,
//   userController.updateUserDetails
// )

router.patch(
  "/phone/update",
  authMiddleware.authCheck,
  userMiddleware.checkEditPhone,
  userController.updateUserDetails
);

router.patch(
  "/token/update",
  authMiddleware.authCheck,
  userController.updateUserDetails
);

module.exports = router;
