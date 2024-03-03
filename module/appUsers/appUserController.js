const appUserService = require("./appUserService");
const helper = require("../../utils/helper");
const createHttpError = require("http-errors");
const {
  validateAddappUserReq,
  validateRegisterappUserReq,
  validateUpdateappUserReq,
  validateLoginReq,
  validateForgotPasswordReq,
  validateResetPasswordReq,
  validateVerificationCodeReq,
  validateappUserSpecificColumn,
  validateCheckUsernameReq,
  validateProfileCoverImageReq,
  validateRemoveProfileCoverImageReq,
  validatedeleteappUser,
} = require("./appUserValidation");

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
    let result = await appUserService.artistLogin(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error);
  }
};
const updateappUserSpecificColumn = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(
        createHttpError(400, { message: "Please pass body parameters" })
      );
    }
    let isValid = await validateappUserSpecificColumn.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid);
    }
    let result = await appUserService.updateappUserSpecificColumn(req);
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
    let result = await appUserService.verificationCode(req);
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
//     let result = await appUserService.forgotPasswordArtist(req);
//     helper.send(res, result.code, result.data);
//   } catch (error) {
//     if (error.isJoi) {
//       return next(createHttpError(400, { message: error.message }));
//     }
//     next(error);
//   }
// };

const addappUser = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(
        createHttpError(400, { message: "Please pass body parameters" })
      );
    }
    let isValid = await validateAddappUserReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid);
    }
    let result = await appUserService.addappUser(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error);
  }
};

const registerappUser = async (req, res, next) => {
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
    let result = await appUserService.registerappUser(req);
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

const getAllappUser = async (req, res, next) => {
  try {
    let result = await appUserService.getAllappUser(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

const getappUser = async (req, res, next) => {
  try {
    let result = await appUserService.getappUser(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
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
  artistLogin,
  // forgotPasswordArtist,
  addappUser,
  registerappUser,
  updateappUser,
  updateappUserSpecificColumn,
  getAllappUser,
  getappUser,
  deleteappUser,
  resetPassword,
  forgotPassword,
  verificationCode,
  profileCoverImage,
  getappUserProfile,
  uploadGalleryImage,
  deleteGalleryImage,
  checkUsername,
  removeProfileCoverImage,
};
