const platformCommissionService = require('./platformCommissionService');
const helper = require("../../utils/helper");
const createHttpError = require('http-errors');
const { validateAddPlatformCommissionReq, validateUpdatePlatformCommissionReq } = require("./platformCommissionValidation");

const addPlatformCommission = async (req, res, next) => {
    try {
        if (!req.body || (Object.keys(req.body).length) === 0) {
            return next(createHttpError(400, { message: 'Please pass body parameters' }));
        }
        let isValid = await validateAddPlatformCommissionReq.validateAsync(req.body);
        if (isValid instanceof Error) {
            return next(isValid)
        }
        let result = await platformCommissionService.addPlatformCommission(req);
        helper.send(res, result.code, result.data);
    } catch (error) {
        if (error.isJoi) {
            return next(createHttpError(400, { message: error.message }));
        }
        next(error)
    }
}

const updatePlatformCommission = async (req, res, next) => {
    try {
        if (!req.body || (Object.keys(req.body).length) === 0) {
            return next(createHttpError(400, { message: 'Please pass body parameters' }));
        }
        let isValid = await validateUpdatePlatformCommissionReq.validateAsync(req.body);
        if (isValid instanceof Error) {
            return next(isValid)
        }
        let result = await platformCommissionService.updatePlatformCommission(req);
        helper.send(res, result.code, result.data);
    } catch (error) {
        if (error.isJoi) {
            return next(createHttpError(400, { message: error.message }));
        }
        next(error)
    }
}

const getAllPlatformCommission = async (req, res, next) => {
    try {
        let result = await platformCommissionService.getAllPlatformCommission(req);
        helper.send(res, result.code, result.data);
    } catch (error) {
        next(error)
    }
}

const getPlatformCommission = async (req, res, next) => {
    try {
        let result = await platformCommissionService.getPlatformCommission(req);
        helper.send(res, result.code, result.data);
    } catch (error) {
        next(error)
    }
}

const deletePlatformCommission = async (req, res, next) => {
    try {
        let result = await platformCommissionService.deletePlatformCommission(req);
        helper.send(res, result.code, result.data);
    } catch (error) {
        next(error)
    }
}

module.exports = {
    addPlatformCommission,
    updatePlatformCommission,
    getAllPlatformCommission,
    getPlatformCommission,
    deletePlatformCommission
}