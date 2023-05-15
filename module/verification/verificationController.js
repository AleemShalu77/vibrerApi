const verificationService = require('./verificationService');
const helper = require("../../utils/helper");
const createHttpError = require('http-errors');
const { validateAddVerificationReq, validateUpdateVerificationReq } = require("./verificationValidation");

const addVerification = async (req, res, next) => {
  try {
    if (!req.body || (Object.keys(req.body).length) === 0) {
      return next(createHttpError(400, { message: 'Please pass body parameters' }));
    }
    let isValid = await validateAddVerificationReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid)
    }
    let result = await verificationService.addVerification(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error)
  }
}

const updateVerification = async (req, res, next) => {
  try {
    if (!req.body || (Object.keys(req.body).length) === 0) {
      return next(createHttpError(400, { message: 'Please pass body parameters' }));
    }
    let isValid = await validateUpdateVerificationReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid)
    }
    let result = await verificationService.updateVerification(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error)
  }
}

const getAllVerification = async (req, res, next) => {
  try {
    let result = await verificationService.getAllVerification(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error)
  }
}

const getVerification = async (req, res, next) => {
  try {
    let result = await verificationService.getVerification(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error)
  }
}

const deleteVerification = async (req, res, next) => {
  try {
    let result = await verificationService.deleteVerification(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error)
  }
}

module.exports = {
  addVerification,
  updateVerification,
  getAllVerification,
  getVerification,
  deleteVerification
}