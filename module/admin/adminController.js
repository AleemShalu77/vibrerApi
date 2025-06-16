const adminService = require("./adminService");
const helper = require("../../utils/helper");
const createHttpError = require("http-errors");
const passport = require("passport");
const {
  validateAddUserReq,
  validateLoginReq,
  validateUpdateUserReq,
  validateForgotPasswordReq,
  validateResetPasswordReq,
  validateVerificationCodeReq,
} = require("./adminValidation");

const validateRequestBody = (req, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return next(createHttpError(400, { message: "Request body is required." }));
  }
};

const login = async (req, res, next) => {
  try {
    validateRequestBody(req, next);

    await validateLoginReq.validateAsync(req.body);
    const result = await adminService.login(req);

    helper.send(res, result.code, result.data);
  } catch (error) {
    next(
      error.isJoi ? createHttpError(400, { message: error.message }) : error
    );
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    validateRequestBody(req, next);

    await validateForgotPasswordReq.validateAsync(req.body);
    const result = await adminService.forgotPassword(req);

    helper.send(res, result.code, result.data);
  } catch (error) {
    next(
      error.isJoi ? createHttpError(400, { message: error.message }) : error
    );
  }
};

const resetPassword = async (req, res, next) => {
  try {
    validateRequestBody(req, next);

    await validateResetPasswordReq.validateAsync(req.body);
    const result = await adminService.resetPassword(req);

    helper.send(res, result.code, result.data);
  } catch (error) {
    next(
      error.isJoi ? createHttpError(400, { message: error.message }) : error
    );
  }
};

const verificationCode = async (req, res, next) => {
  try {
    validateRequestBody(req, next);

    await validateVerificationCodeReq.validateAsync(req.body);
    const result = await adminService.verificationCode(req);

    helper.send(res, result.code, result.data);
  } catch (error) {
    next(
      error.isJoi ? createHttpError(400, { message: error.message }) : error
    );
  }
};

const addUser = async (req, res, next) => {
  try {
    validateRequestBody(req, next);

    await validateAddUserReq.validateAsync(req.body);

    passport.authenticate("local-signup-admin", (err, user, info) => {
      if (err) return next(err);
      if (!user)
        return res.status(400).json({ code: 204, message: info.message });

      const fullName = req.body.firstName
        ? `${req.body.firstName} ${req.body.lastName || ""}`.trim()
        : req.body.fullName || "Admin";

      const displayName = `${fullName} account`;
      helper.send(res, 201, user, "", displayName);
    })(req, res, next);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    validateRequestBody(req, next);

    await validateUpdateUserReq.validateAsync(req.body);
    const result = await adminService.updateUser(req);

    const displayName = `${req.body.firstName || "Admin"} account`;
    helper.send(res, result.code, result.data, "", displayName);
  } catch (error) {
    next(
      error.isJoi ? createHttpError(400, { message: error.message }) : error
    );
  }
};

const getAllUser = async (req, res, next) => {
  try {
    const result = await adminService.getAllUser(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const result = await adminService.getUser(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const result = await adminService.deleteUser(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  forgotPassword,
  resetPassword,
  verificationCode,
  addUser,
  updateUser,
  getAllUser,
  getUser,
  deleteUser,
};
