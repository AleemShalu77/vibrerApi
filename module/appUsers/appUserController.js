const appUserService = require("./appUserService");
const helper = require("../../utils/helper");
const createHttpError = require("http-errors");
const {
  validateRegisterappUserReq,
  validateUpdateappUserReq,
  validateLoginReq,
  validateForgotPasswordReq,
  validateResetPasswordReq,
  validateVerificationCodeReq,
  validateCheckUsernameReq,
  validateProfileCoverImageReq,
  validateRemoveProfileCoverImageReq,
  validatedeleteappUser,
} = require("./appUserValidation");

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
    let result = await appUserService.login(req);
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
    let result = await appUserService.forgotPassword(req);
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
    let result = await appUserService.resetPassword(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error);
  }
};
const verifyEmail = async (req, res, next) => {
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
    let result = await appUserService.verifyEmail(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error);
  }
};

const registerAppUser = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(
        createHttpError(400, { message: "Please pass body parameters" })
      );
    }
    let isValid = await validateRegisterappUserReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid);
    }
    let result = await appUserService.registerAppUser(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error);
  }
};

const updateappUser = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(
        createHttpError(400, { message: "Please pass body parameters" })
      );
    }
    let isValid = await validateUpdateappUserReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid);
    }
    let result = await appUserService.updateappUser(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error);
  }
};

const getappUserProfile = async (req, res, next) => {
  try {
    let result = await appUserService.getappUserProfile(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

const deleteappUser = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(
        createHttpError(400, { message: "Please pass body parameters" })
      );
    }
    let isValid = await validatedeleteappUser.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid);
    }
    let result = await appUserService.deleteappUser(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

const profileCoverImage = async (req, res, next) => {
  try {
    let isValid = await validateProfileCoverImageReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid);
    }
    let result = await appUserService.profileCoverImage(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error);
  }
};

const removeProfileCoverImage = async (req, res, next) => {
  try {
    let isValid = await validateRemoveProfileCoverImageReq.validateAsync(
      req.body
    );
    if (isValid instanceof Error) {
      return next(isValid);
    }
    let result = await appUserService.removeProfileCoverImage(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

const uploadGalleryImage = async (req, res, next) => {
  try {
    let result = await appUserService.uploadGalleryImage(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error);
  }
};

const deleteGalleryImage = async (req, res, next) => {
  try {
    let result = await appUserService.deleteGalleryImage(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

const checkUsername = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(
        createHttpError(400, { message: "Please pass body parameters" })
      );
    }
    let isValid = await validateCheckUsernameReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid);
    }
    let result = await appUserService.checkUsername(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error);
  }
};

module.exports = {
  login,
  registerAppUser,
  updateappUser,
  deleteappUser,
  resetPassword,
  forgotPassword,
  verifyEmail,
  profileCoverImage,
  getappUserProfile,
  uploadGalleryImage,
  deleteGalleryImage,
  checkUsername,
  removeProfileCoverImage,
};
