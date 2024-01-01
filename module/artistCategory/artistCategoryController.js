const artistCategoryService = require("./artistCategoryService");
const helper = require("../../utils/helper");
const createHttpError = require("http-errors");
const {
  validateAddArtistReq,
  validateUpdateArtistReq,
} = require("./artistCategoryValidation");

const addartistCategory = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(
        createHttpError(400, { message: "Please pass body parameters" })
      );
    }
    let isValid = await validateAddArtistReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid);
    }
    let result = await artistCategoryService.addartistCategory(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error);
  }
};

const updateartistCategory = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(
        createHttpError(400, { message: "Please pass body parameters" })
      );
    }
    let isValid = await validateUpdateArtistReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid);
    }
    let result = await artistCategoryService.updateartistCategory(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error);
  }
};

const getAllartistCategory = async (req, res, next) => {
  try {
    let result = await artistCategoryService.getAllartistCategory(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

const getartistCategory = async (req, res, next) => {
  try {
    if (
      !req.params.id ||
      Object.keys(req.params).length === 0 ||
      req.params.id == "undefined"
    ) {
      return next(createHttpError(400, { message: "Please pass id" }));
    }
    let result = await artistCategoryService.getartistCategory(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

const deleteartistCategory = async (req, res, next) => {
  try {
    if (
      !req.params.id ||
      Object.keys(req.params).length === 0 ||
      req.params.id == "undefined"
    ) {
      return next(createHttpError(400, { message: "Please pass id" }));
    }
    let result = await artistCategoryService.deleteartistCategory(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addartistCategory,
  updateartistCategory,
  getAllartistCategory,
  getartistCategory,
  deleteartistCategory,
};
