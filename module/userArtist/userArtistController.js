const UserArtistService = require('./UserArtistService');
const helper = require("../../utils/helper");
const createHttpError = require('http-errors');
const { validateAddUserArtistReq, validateUpdateUserArtistReq } = require("./UserArtistValidation");

const addUserArtist = async (req, res, next) => {
    try {
        if (!req.body || (Object.keys(req.body).length) === 0) {
            return next(createHttpError(400, { message: 'Please pass body parameters' }));
        }
        let isValid = await validateAddUserArtistReq.validateAsync(req.body);
        if (isValid instanceof Error) {
            return next(isValid)
        }
        let result = await UserArtistService.addUserArtist(req);
        helper.send(res, result.code, result.data);
    } catch (error) {
        if (error.isJoi) {
            return next(createHttpError(400, { message: error.message }));
        }
        next(error)
    }
}

const updateUserArtist = async (req, res, next) => {
    try {
        if (!req.body || (Object.keys(req.body).length) === 0) {
            return next(createHttpError(400, { message: 'Please pass body parameters' }));
        }
        let isValid = await validateUpdateUserArtistReq.validateAsync(req.body);
        if (isValid instanceof Error) {
            return next(isValid)
        }
        let result = await UserArtistService.updateUserArtist(req);
        helper.send(res, result.code, result.data);
    } catch (error) {
        if (error.isJoi) {
            return next(createHttpError(400, { message: error.message }));
        }
        next(error)
    }
}

const getAllUserArtist = async (req, res, next) => {
    try {
        let result = await UserArtistService.getAllUserArtist(req);
        helper.send(res, result.code, result.data);
    } catch (error) {
        next(error)
    }
}

const getUserArtist = async (req, res, next) => {
    try {
        let result = await UserArtistService.getUserArtist(req);
        helper.send(res, result.code, result.data);
    } catch (error) {
        next(error)
    }
}

const deleteUserArtist = async (req, res, next) => {
    try {
        let result = await UserArtistService.deleteUserArtist(req);
        helper.send(res, result.code, result.data);
    } catch (error) {
        next(error)
    }
}

module.exports = {
    addUserArtist,
    updateUserArtist,
    getAllUserArtist,
    getUserArtist,
    deleteUserArtist
}