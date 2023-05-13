const VirtualGiftsService = require('./VirtualGiftsService');
const helper = require("../../utils/helper");
const createHttpError = require('http-errors');
const { validateAddVirtualGiftReq, validateUpdateVirtualGiftReq } = require("./VirtualGiftValidation");

const addVirtualGift = async (req, res, next) => {
  try {
    if (!req.body || (Object.keys(req.body).length) === 0) {
      return next(createHttpError(400, { message: 'Please pass body parameters' }));
    }
    let isValid = await validateAddVirtualGiftReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid)
    }
    let result = await VirtualGiftsService.addVirtualGift(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error)
  }
}

const updateVirtualGift = async (req, res, next) => {
  try {
    if (!req.body || (Object.keys(req.body).length) === 0) {
      return next(createHttpError(400, { message: 'Please pass body parameters' }));
    }
    let isValid = await validateUpdateVirtualGiftReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid)
    }
    let result = await VirtualGiftsService.updateVirtualGift(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error)
  }
}

const getAllVirtualGift = async (req, res, next) => {
  try {
    let result = await VirtualGiftsService.getAllVirtualGift(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error)
  }
}

const getVirtualGift = async (req, res, next) => {
  try {
    let result = await VirtualGiftsService.getVirtualGift(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error)
  }
}

const deleteVirtualGift = async (req, res, next) => {
  try {
    let result = await VirtualGiftsService.deleteVirtualGift(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error)
  }
}

module.exports = {
  addVirtualGift,
  updateVirtualGift,
  getAllVirtualGift,
  getVirtualGift,
  deleteVirtualGift
}