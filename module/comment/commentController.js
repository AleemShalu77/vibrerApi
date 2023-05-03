const commentService = require('./commentService');
const helper = require("../../utils/helper");
const createHttpError = require('http-errors');
const { validateAddCommentReq,validateUpdateCommentReq} = require("./commentValidation");

const addComment= async (req, res, next) => {
  try {
    if(!req.body || (Object.keys(req.body).length) === 0)
      {
          return next(createHttpError(400,{message:'Please pass body parameters'}));
      } 
    let isValid = await validateAddCommentReq.validateAsync(req.body);
    if(isValid instanceof Error){
      return next(isValid)
    }
    let result = await commentService.addComment(req);
    helper.send(res,result.code,result.data); 
  } catch(error) {
    if(error.isJoi){
      return next(createHttpError(400,{message:error.message}));
  }
  next(error)
 }
}

const updateComment = async(req, res, next) => {
  try {
    if(!req.body || (Object.keys(req.body).length) === 0)
      {
          return next(createHttpError(400,{message:'Please pass body parameters'}));
      } 
    let isValid = await validateUpdateCommentReq.validateAsync(req.body);
    if(isValid instanceof Error){
      return next(isValid)
    }
    let result = await commentService.updateComment(req);
    helper.send(res,result.code,result.data); 
  } catch(error) {
    if(error.isJoi){
      return next(createHttpError(400,{message:error.message}));
  }
  next(error)
 }
}

const getAllComment = async(req, res, next) => {
  try {
    let result = await commentService.getAllComment(req);
    helper.send(res,result.code,result.data); 
  } catch(error) {
  next(error)
 }
}

const getComment = async(req, res, next) => {
  try {
    if(!req.query || (Object.keys(req.query).length) === 0)
    {
        return next(createHttpError(400,{message:'Please pass query parameters'}));
    } 
    let result = await commentService.getComment(req);
    helper.send(res,result.code,result.data); 
  } catch(error) {
  next(error)
 }
}

const deleteComment = async(req, res, next) => {
  try {
    if(!req.query || (Object.keys(req.query).length) === 0)
    {
        return next(createHttpError(400,{message:'Please pass query parameters'}));
    }
    let result = await commentService.deleteComment(req);
    helper.send(res,result.code,result.data); 
  } catch(error) {
  next(error)
 }
}

module.exports = {
    addComment,
    updateComment,
    getAllComment,
    getComment,
    deleteComment
}