// import modules
const express = require("express");

// init router
const router = express.Router();

// import middlewares
const authMiddleware = require("../middlewares/auth");

// import models
const transactionsModel = require("../models/Transaction");

// import helpers
const response = require("../helpers/response");

router.get("/chart/this-week", authMiddleware.authCheck, async (req, res) => {
  const { id } = req.userData;
  try {
    const today = new Date().toISOString().slice(0, 10);
    const dateNow = new Date(
      new Date(today).getTime() + 1 * 31 * 60 * 60 * 1000
    )
      .toISOString()
      .slice(0, 10);
    const lastWeekDate = new Date(
      new Date(dateNow).getTime() - 7 * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .slice(0, 10);

    console.log(`${dateNow} & ${lastWeekDate}`);
    const initalResult = await transactionsModel.getTransactionLastWeek(
      id,
      dateNow,
      lastWeekDate
    );

    if (initalResult.length < 1) {
      return response(res, 200, true, "You havent made a transaction");
    }

    const finalResult = Object.values(
      initalResult.reduce((unique, item) => {
        if (!unique[item.transactionDate.toISOString().slice(0, 10)]) {
          unique[item.transactionDate.toISOString().slice(0, 10)] = {
            asSender: initalResult
              .reduce((value, result) => {
                if (
                  result.is_transfer &&
                  item.transactionDate.toISOString().slice(0, 10) ===
                    result.transactionDate.toISOString().slice(0, 10)
                ) {
                  value.push(result.amount);
                } else {
                  value.push(0);
                }
                return value;
              }, [])
              .reduce((prev, next) => prev + next),
            asReceiver: initalResult
              .reduce((value, result) => {
                if (
                  !result.is_transfer &&
                  item.transactionDate.toISOString().slice(0, 10) ===
                    result.transactionDate.toISOString().slice(0, 10)
                ) {
                  value.push(result.amount);
                } else {
                  value.push(0);
                }
                return value;
              }, [])
              .reduce((prev, next) => prev + next),
            day: String(item.transactionDate).slice(0, 3),
          };
        }

        return unique;
      }, {})
    );

    if (finalResult.length < 7) {
      const addResult = 7 - finalResult.length;
      for (let initial = 0; initial < addResult; initial++) {
        const obj = {
          asSender: 0,
          asReceiver: 0,
          day: " ",
        };
        finalResult.push(obj);
      }
    }

    return response(res, 200, true, "Transactions on This Week", finalResult);
  } catch (err) {
    console.log(err);
    return response(res, 400, false, "Bad request!");
  }
});

module.exports = router;
