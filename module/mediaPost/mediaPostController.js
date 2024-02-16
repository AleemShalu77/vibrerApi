const mediaPostService = require("./mediaPostService");
const helper = require("../../utils/helper");
const createHttpError = require("http-errors");
const {
  validateaddMediaPostReq,
  validateContestParticipateVoteReq,
  validateaddToFavouriteReq,
  validateupdateMediaPostStatusReq,
} = require("./mediaPostValidation");

const addMediaPost = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(
        createHttpError(400, { message: "Please pass body parameters" })
      );
    }
    let isValid = await validateaddMediaPostReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid);
    }
    let result = await mediaPostService.addMediaPost(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error);
  }
};

const updateMediaPostStatus = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(
        createHttpError(400, { message: "Please pass body parameters" })
      );
    }
    let isValid = await validateupdateMediaPostStatusReq.validateAsync(
      req.body
    );
    if (isValid instanceof Error) {
      return next(isValid);
    }
    let result = await mediaPostService.updateMediaPostStatus(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error);
  }
};

const contestParticipateVote = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(
        createHttpError(400, { message: "Please pass body parameters" })
      );
    }
    let isValid = await validateContestParticipateVoteReq.validateAsync(
      req.body
    );
    if (isValid instanceof Error) {
      return next(isValid);
    }
    let result = await mediaPostService.contestParticipateVote(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error);
  }
};

const addToFavourite = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(
        createHttpError(400, { message: "Please pass body parameters" })
      );
    }
    let isValid = await validateaddToFavouriteReq.validateAsync(req.body);
    if (isValid instanceof Error) {
      return next(isValid);
    }
    let result = await mediaPostService.addToFavourite(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    if (error.isJoi) {
      return next(createHttpError(400, { message: error.message }));
    }
    next(error);
  }
};

const getAllFavouriteContestParticipants = async (req, res, next) => {
  try {
    let result = await mediaPostService.getAllFavouriteContestParticipants(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

const getVotedContestParticipants = async (req, res, next) => {
  try {
    let result = await mediaPostService.getVotedContestParticipants(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};
const getUserParticipatedContests = async (req, res, next) => {
  try {
    let result = await mediaPostService.getUserParticipatedContests(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

// const getMediaPost = async (req, res, next) => {
//     try {
//         let result = await concertService.getMediaPost(req);
//         helper.send(res, result.code, result.data);
//     } catch (error) {
//         next(error)
//     }
// }

const deleteMediaPost = async (req, res, next) => {
  try {
    let result = await mediaPostService.deleteMediaPost(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

const adminDashboardCount = async (req, res, next) => {
  try {
    let result = await mediaPostService.adminDashboardCount(req);
    helper.send(res, result.code, result.data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addMediaPost,
  contestParticipateVote,
  updateMediaPostStatus,
  // getAllMediaPost,
  // getMediaPost,
  deleteMediaPost,
  addToFavourite,
  getAllFavouriteContestParticipants,
  getVotedContestParticipants,
  getUserParticipatedContests,
  adminDashboardCount,
};
