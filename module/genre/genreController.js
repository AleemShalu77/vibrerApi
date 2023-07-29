const GenreService = require('./genreService');
const helper = require("../../utils/helper");
const createHttpError = require('http-errors');
const { validateAddGenreReq, validateUpdateGenreReq } = require("./genreValidation");

const addGenre = async (req, res, next) => {
  try {
    if (!req.body || (Object.keys(req.body).length) === 0) {
      return next(createHttpError(400, { message: 'Please pass body parameters' }));
    }
    let isValid = await validateAddGenreReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid)
    }
    let result = await GenreService.addGenre(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error)
  }
}

const updateGenre = async (req, res, next) => {
  try {
    if (!req.body || (Object.keys(req.body).length) === 0) {
      return next(createHttpError(400, { message: 'Please pass body parameters' }));
    }
    let isValid = await validateUpdateGenreReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid)
    }
    let result = await GenreService.updateGenre(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error)
  }
}

const getAllGenre = async (req, res, next) => {
  try {
    let result = await GenreService.getAllGenre(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error)
  }
}

const getGenre = async (req, res, next) => {
  try {
    if (!req.params.id || (Object.keys(req.params).length) === 0 || req.params.id == "undefined") {
      return next(createHttpError(400, { message: 'Please pass id' }));
    }
    let result = await GenreService.getGenre(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error)
  }
}

const deleteGenre = async (req, res, next) => {
  try {
    if (!req.params.id || (Object.keys(req.params).length) === 0 || req.params.id == "undefined") {
      return next(createHttpError(400, { message: 'Please pass id' }));
    }
    let result = await GenreService.deleteGenre(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error)
  }
}

module.exports = {
  addGenre,
  updateGenre,
  getAllGenre,
  getGenre,
  deleteGenre
}