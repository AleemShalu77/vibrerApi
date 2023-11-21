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

const login = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(
        createHttpError(400, { message: "Please pass body parameters" })
      );
    }
    let isValid = await validateLoginReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid);
    }
    let result = await adminService.login(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(
        createHttpError(400, { message: "Please pass body parameters" })
      );
    }
    let isValid = await validateForgotPasswordReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid);
    }
    let result = await adminService.forgotPassword(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error);
  }
};
const resetPassword = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(
        createHttpError(400, { message: "Please pass body parameters" })
      );
    }
    let isValid = await validateResetPasswordReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid);
    }
    let result = await adminService.resetPassword(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error);
  }
};
const verificationCode = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(
        createHttpError(400, { message: "Please pass body parameters" })
      );
    }
    let isValid = await validateVerificationCodeReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid);
    }
    let result = await adminService.verificationCode(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error);
  }
};

const addUser = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(
        createHttpError(400, { message: "Please pass body parameters" })
      );
    }

    // Validate the request body using Joi
    let isValid;
    try {
      isValid = await validateAddUserReq.validateAsync(req.body);
    } catch (validationError) {
      return next(createHttpError(400, { message: validationError.message }));
    }

    // Call Passport.js to authenticate and register the user
    passport.authenticate("local-signup", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(400).json({ code: 204, message: info.message });
      }

      // User registration successful
      const name = `${req.body.first_name} account`;
      helper.send(res, 201, user, "", name);
    })(req, res, next);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(
        createHttpError(400, { message: "Please pass body parameters" })
      );
    }
    let isValid = await validateUpdateUserReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid);
    }
    const name = req.body.first_name + " " + "account";
    let result = await adminService.updateUser(req);
    helper.send(res, result.code, result.data, "", name);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error);
  }
};

const getAllUser = async (req, res, next) => {
  try {
    let result = await adminService.getAllUser(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    let result = await adminService.getUser(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    let result = await adminService.deleteUser(req);
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
