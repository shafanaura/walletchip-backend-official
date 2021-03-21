// import all modules
const express = require("express");

// init router
const router = express.Router();

router.get("/redirect/:method", (req, res) => {
  const { method } = req.params;
  const { token } = req.query;

  res.redirect(`walletchip://${method}/${token}`);
});

module.exports = router;
