const coinPriceService = require('./coinPriceService');
const helper = require("../../utils/helper");
const createHttpError = require('http-errors');
const { validateAddCoinPriceReq, validateUpdateCoinPriceReq } = require("./coinPriceValidation");

const addCoinPrice = async (req, res, next) => {
  try {
    if (!req.body || (Object.keys(req.body).length) === 0) {
      return next(createHttpError(400, { message: 'Please pass body parameters' }));
    }
    if(req.body['icon'])
    {
      req.body.icon = JSON.parse(req.body['icon']);
      if((req.body.icon).length === 0)
      {
        return next(createHttpError(400, { message: '`icon` can not be empty' }));

      }
    }
    else
    {
      return next(createHttpError(400, { message: 'Please pass `icon`' }));
    }
    let isValid = await validateAddCoinPriceReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid)
    }
    let result = await coinPriceService.addCoinPrice(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error)
  }
}

const updateCoinPrice = async (req, res, next) => {
  try {
    if (!req.body || (Object.keys(req.body).length) === 0) {
      return next(createHttpError(400, { message: 'Please pass body parameters' }));
    }
    let isValid = await validateUpdateCoinPriceReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid)
    }
    let result = await coinPriceService.updateCoinPrice(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error)
  }
}

const getAllCoinPrice = async (req, res, next) => {
  try {
    let result = await coinPriceService.getAllCoinPrice(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error)
  }
}

const getCoinPrice = async (req, res, next) => {
  try {
    let result = await coinPriceService.getCoinPrice(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error)
  }
}

const deleteCoinPrice = async (req, res, next) => {
  try {
    let result = await coinPriceService.deleteCoinPrice(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error)
  }
}

module.exports = {
  addCoinPrice,
  updateCoinPrice,
  getAllCoinPrice,
  getCoinPrice,
  deleteCoinPrice
}