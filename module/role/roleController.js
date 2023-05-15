const roleService = require('./roleService');
const helper = require("../../utils/helper");
const createHttpError = require('http-errors');
const { validateAddRoleReq, validateUpdateRoleReq } = require("./roleValidation");

const addRole = async (req, res, next) => {
  try {
    if (!req.body || (Object.keys(req.body).length) === 0) {
      return next(createHttpError(400, { message: 'Please pass body parameters' }));
    }
    let isValid = await validateAddRoleReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid)
    }
    let result = await roleService.addRole(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error)
  }
}

const updateRole = async (req, res, next) => {
  try {
    if (!req.body || (Object.keys(req.body).length) === 0) {
      return next(createHttpError(400, { message: 'Please pass body parameters' }));
    }
    let isValid = await validateUpdateRoleReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid)
    }
    let result = await roleService.updateRole(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error)
  }
}

const getAllRole = async (req, res, next) => {
  try {
    let result = await roleService.getAllRole(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error)
  }
}

const getRole = async (req, res, next) => {
  try {
    let result = await roleService.getRole(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error)
  }
}

const deleteRole = async (req, res, next) => {
  try {
    let result = await roleService.deleteRole(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error)
  }
}

module.exports = {
  addRole,
  updateRole,
  getAllRole,
  getRole,
  deleteRole
}