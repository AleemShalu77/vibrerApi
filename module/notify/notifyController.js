const notifyService = require("./notifyService");
const helper = require("../../utils/helper");
const createHttpError = require("http-errors");
const { validateNotifyReq } = require("./notifyValidation");

const addToNotifyList = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(
        createHttpError(400, { message: "Please pass body parameters" })
      );
    }
    let isValid = await validateNotifyReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid);
    }
    let result = await notifyService.addToNotifyList(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error);
  }
};

module.exports = {
  addToNotifyList,
};
