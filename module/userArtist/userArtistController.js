const UserArtistService = require("./userArtistService");
const helper = require("../../utils/helper");
const createHttpError = require("http-errors");
const {
  validateAddUserArtistReq,
  validateUpdateUserArtistReq,
  validateLoginReq,
  validateForgotPasswordReq,
  validateResetPasswordReq,
  validateVerificationCodeReq,
  validateUserArtistSpecificColumn,
} = require("./userArtistValidation");

const artistLogin = async (req, res, next) => {
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
    let result = await UserArtistService.artistLogin(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error);
  }
};
const updateUserArtistSpecificColumn = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(
        createHttpError(400, { message: "Please pass body parameters" })
      );
    }
    let isValid = await validateUserArtistSpecificColumn.validateAsync(
      req.body
    );
    if (isValid instanceof Error) {
      return next(isValid);
    }
    let result = await UserArtistService.updateUserArtistSpecificColumn(req);
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
    let result = await UserArtistService.forgotPassword(req);
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
    let result = await UserArtistService.resetPassword(req);
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
    let result = await UserArtistService.verificationCode(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error);
  }
};
// const forgotPasswordArtist = async (req, res, next) => {
//   try {
//     if (!req.body || Object.keys(req.body).length === 0) {
//       return next(
//         createHttpError(400, { message: "Please pass body parameters" })
//       );
//     }
//     let isValid = await validateResetPasswordReq.validateAsync(req.body);
//     if (isValid instanceof Error) {
//       return next(isValid);
//     }
//     let result = await UserArtistService.forgotPasswordArtist(req);
//     helper.send(res, result.code, result.data);
//   } catch (error) {
//     if (error.isJoi) {
//       return next(createHttpError(400, { message: error.message }));
//     }
//     next(error);
//   }
// };

const addUserArtist = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(
        createHttpError(400, { message: "Please pass body parameters" })
      );
    }
    let isValid = await validateAddUserArtistReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid);
    }
    let result = await UserArtistService.addUserArtist(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error);
  }
};

const updateUserArtist = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(
        createHttpError(400, { message: "Please pass body parameters" })
      );
    }
    let isValid = await validateUpdateUserArtistReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid);
    }
    let result = await UserArtistService.updateUserArtist(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error);
  }
};

const getAllUserArtist = async (req, res, next) => {
  try {
    let result = await UserArtistService.getAllUserArtist(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

const getUserArtist = async (req, res, next) => {
  try {
    let result = await UserArtistService.getUserArtist(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

const deleteUserArtist = async (req, res, next) => {
  try {
    let result = await UserArtistService.deleteUserArtist(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  artistLogin,
  // forgotPasswordArtist,
  addUserArtist,
  updateUserArtist,
  updateUserArtistSpecificColumn,
  getAllUserArtist,
  getUserArtist,
  deleteUserArtist,
  resetPassword,
  forgotPassword,
  verificationCode,
};
